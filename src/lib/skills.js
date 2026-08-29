// Skills are separate from interest tags (hobby/culture/language).
// A skill states a direction — teach (what you know) or learn (what you
// want to pick up) — plus a rough proficiency level.

export const SKILL_LEVELS = [
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
]

export const SKILL_DIRECTIONS = [
  { key: 'teach', label: 'I can teach' },
  { key: 'learn', label: 'I want to learn' },
]

export function levelLabel(key) {
  return SKILL_LEVELS.find((l) => l.key === key)?.label ?? key
}

// Renders a skills array into the "Can teach: ..." / "Want to learn: ..."
// strings used on the Teach & Learn board.
export function formatSkills(skills = []) {
  const teach = skills.filter((s) => s.direction === 'teach')
  const learn = skills.filter((s) => s.direction === 'learn')

  const describe = (s) => (s.level ? `${s.label} (${levelLabel(s.level)})` : s.label)

  return {
    offering: teach.length ? `Can teach: ${teach.map(describe).join(', ')}` : '',
    seeking: learn.length ? `Want to learn: ${learn.map(describe).join(', ')}` : '',
  }
}

// Generic modifier words that show up across unrelated skill labels — ignored
// so "Guitar basics" doesn't false-positive match "Painting basics".
const GENERIC_WORDS = new Set([
  'basics', 'basic', 'lessons', 'lesson', 'practice', 'tips', 'tricks', 'skills', 'skill',
  'conversational', 'conversation', 'properly', 'advanced', 'beginner', 'intermediate',
  'techniques', 'technique', 'fundamentals', 'guide', 'tutorial', 'class', 'classes',
  'session', 'sessions', 'basic', 'proper', 'introduction', 'intro',
])

function tokenize(label) {
  return label
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3 && !GENERIC_WORDS.has(word))
}

// Two skill labels "relate" if they share a meaningful word once generic
// modifiers are stripped — e.g. "Adobo recipes" / "Cooking adobo properly"
// share "adobo"; "Guitar basics" / "Painting basics" share nothing after
// "basics" is filtered out.
function labelsRelate(a, b) {
  const tokensA = tokenize(a)
  const tokensB = tokenize(b)
  if (!tokensA.length || !tokensB.length) return false
  return tokensA.some((t) => tokensB.includes(t))
}

// A candidate is relevant to the Teach & Learn board only if there's an
// actual trade opportunity: they can teach something the user wants to
// learn, or the user can teach something they want to learn.
export function findSkillMatch(currentUser, candidate) {
  const myTeach = (currentUser.skills ?? []).filter((s) => s.direction === 'teach')
  const myLearn = (currentUser.skills ?? []).filter((s) => s.direction === 'learn')
  const theirTeach = (candidate.skills ?? []).filter((s) => s.direction === 'teach')
  const theirLearn = (candidate.skills ?? []).filter((s) => s.direction === 'learn')

  const theyCanTeachMe = theirTeach.filter((t) => myLearn.some((m) => labelsRelate(t.label, m.label)))
  const iCanTeachThem = myTeach.filter((t) => theirLearn.some((m) => labelsRelate(t.label, m.label)))

  return { theyCanTeachMe, iCanTeachThem, isMatch: theyCanTeachMe.length > 0 || iCanTeachThem.length > 0 }
}
