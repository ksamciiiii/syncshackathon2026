import { supabase } from './supabaseClient'

// --- identity ---------------------------------------------------------

export async function ensureSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) return session
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.session
}

// --- profiles -----------------------------------------------------------

const PROFILE_SELECT = '*, tags(*), skills(*)'

export async function fetchMyProfile() {
  const session = await ensureSession()
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('auth_user_id', session.user.id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function createProfile({ username, neighborhood, tags, skills }) {
  const session = await ensureSession()
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({ username, neighborhood, auth_user_id: session.user.id })
    .select()
    .single()
  if (error) throw error
  await writeTagsAndSkills(profile.id, tags, skills)
  return fetchProfileById(profile.id)
}

export async function updateProfile(profileId, { username, neighborhood, tags, skills }) {
  const { error } = await supabase
    .from('profiles')
    .update({ username, neighborhood })
    .eq('id', profileId)
  if (error) throw error
  // Simplest correct way to reconcile a tag/skill list: replace wholesale.
  await supabase.from('tags').delete().eq('profile_id', profileId)
  await supabase.from('skills').delete().eq('profile_id', profileId)
  await writeTagsAndSkills(profileId, tags, skills)
  return fetchProfileById(profileId)
}

async function writeTagsAndSkills(profileId, tags, skills) {
  if (tags?.length) {
    const { error } = await supabase
      .from('tags')
      .insert(tags.map((t) => ({ profile_id: profileId, label: t.label, type: t.type })))
    if (error) throw error
  }
  if (skills?.length) {
    const { error } = await supabase
      .from('skills')
      .insert(skills.map((s) => ({ profile_id: profileId, label: s.label, direction: s.direction, level: s.level })))
    if (error) throw error
  }
}

async function fetchProfileById(id) {
  const { data, error } = await supabase.from('profiles').select(PROFILE_SELECT).eq('id', id).single()
  if (error) throw error
  return data
}

export async function fetchOtherProfiles(excludeProfileId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .neq('id', excludeProfileId)
  if (error) throw error
  return data
}

// --- need posts -----------------------------------------------------------

export async function fetchNeedPosts() {
  const { data, error } = await supabase
    .from('need_posts')
    .select('*, profiles(username)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function postNeed(profileId, needText) {
  const { data, error } = await supabase
    .from('need_posts')
    .insert({ profile_id: profileId, need_text: needText })
    .select('*, profiles(username)')
    .single()
  if (error) throw error
  return data
}

// --- connections + chat -----------------------------------------------------------

export async function sendConnectionRequest(myProfileId, recipientId) {
  const { data: existing } = await supabase
    .from('connections')
    .select('*')
    .or(
      `and(requester_id.eq.${myProfileId},recipient_id.eq.${recipientId}),and(requester_id.eq.${recipientId},recipient_id.eq.${myProfileId})`
    )
    .maybeSingle()
  if (existing) return existing

  const { data, error } = await supabase
    .from('connections')
    .insert({ requester_id: myProfileId, recipient_id: recipientId, status: 'pending' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchMyConnections(myProfileId) {
  const { data, error } = await supabase
    .from('connections')
    .select('*, requester:requester_id(id,username), recipient:recipient_id(id,username)')
    .or(`requester_id.eq.${myProfileId},recipient_id.eq.${myProfileId}`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function respondToConnection(connectionId, status) {
  const { data, error } = await supabase
    .from('connections')
    .update({ status })
    .eq('id', connectionId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function saveNickname(connectionId, nickname) {
  const { error } = await supabase.from('connections').update({ nickname }).eq('id', connectionId)
  if (error) throw error
}

// List-level subscription for a "people I've contacted" view — fires on any
// change to a connection the user is a participant in (new request in
// either direction, accept/decline, nickname edit).
export function subscribeToMyConnections(myProfileId, onChange) {
  const channel = supabase
    .channel(`my-connections:${myProfileId}:${crypto.randomUUID()}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'connections', filter: `recipient_id=eq.${myProfileId}` },
      onChange
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'connections', filter: `requester_id=eq.${myProfileId}` },
      onChange
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}

export async function fetchMessages(connectionId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('connection_id', connectionId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function sendMessage(connectionId, senderId, body) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ connection_id: connectionId, sender_id: senderId, body })
    .select()
    .single()
  if (error) throw error
  return data
}

export function subscribeToMessages(connectionId, onInsert) {
  // Unique-per-call channel name: React StrictMode's dev-mode double-invoke
  // of effects (mount -> cleanup -> mount) would otherwise create two
  // channels with the same topic back-to-back, and the second subscribe
  // can silently miss events while the first is still tearing down.
  const channel = supabase
    .channel(`messages:${connectionId}:${crypto.randomUUID()}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `connection_id=eq.${connectionId}` },
      (payload) => onInsert(payload.new)
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}

export function subscribeToConnection(connectionId, onUpdate) {
  const channel = supabase
    .channel(`connection:${connectionId}:${crypto.randomUUID()}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'connections', filter: `id=eq.${connectionId}` },
      (payload) => onUpdate(payload.new)
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}
