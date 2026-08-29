import { useEffect, useState } from 'react'
import {
  respondToConnection,
  saveNickname,
  fetchMessages,
  sendMessage as sendMessageToDb,
  subscribeToMessages,
  subscribeToConnection,
} from '../lib/db'

export default function ConnectModal({ myProfile, candidate, initialConnection, onClose }) {
  const [connection, setConnection] = useState(initialConnection)
  const [nickname, setNickname] = useState(initialConnection.nickname ?? '')
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [showMeetupForm, setShowMeetupForm] = useState(false)
  const [meetup, setMeetup] = useState({ place: '', date: '', time: '' })
  const [error, setError] = useState(null)

  const isRecipient = connection.recipient_id === myProfile.id

  useEffect(() => {
    const unsubscribe = subscribeToConnection(connection.id, setConnection)
    return unsubscribe
  }, [connection.id])

  useEffect(() => {
    if (connection.status !== 'accepted') return
    fetchMessages(connection.id).then(setMessages).catch((err) => setError(err.message))
    const unsubscribe = subscribeToMessages(connection.id, (m) => setMessages((prev) => [...prev, m]))
    return unsubscribe
  }, [connection.id, connection.status])

  async function respond(status) {
    try {
      const updated = await respondToConnection(connection.id, status)
      setConnection(updated)
    } catch (err) {
      setError(err.message ?? 'Failed to respond.')
    }
  }

  async function handleSaveNickname() {
    if (!nickname.trim()) return
    try {
      await saveNickname(connection.id, nickname.trim())
    } catch (err) {
      setError(err.message ?? 'Failed to save nickname.')
    }
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!draft.trim()) return
    try {
      await sendMessageToDb(connection.id, myProfile.id, draft.trim())
      setDraft('')
    } catch (err) {
      setError(err.message ?? 'Failed to send message.')
    }
  }

  async function sendMeetupSuggestion(e) {
    e.preventDefault()
    if (!meetup.place.trim() || !meetup.date || !meetup.time) return
    try {
      await sendMessageToDb(
        connection.id,
        myProfile.id,
        `📍 Suggested meetup: ${meetup.place.trim()} on ${meetup.date} at ${meetup.time}`
      )
      setMeetup({ place: '', date: '', time: '' })
      setShowMeetupForm(false)
    } catch (err) {
      setError(err.message ?? 'Failed to send meetup suggestion.')
    }
  }

  const displayName = nickname.trim() || candidate.username

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-surface border border-surface2 rounded-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-semibold text-offwhite">{displayName}</h3>
          <button onClick={onClose} className="text-muted hover:text-offwhite">✕</button>
        </div>

        {error && <p className="text-coral text-sm mb-3">{error}</p>}

        {connection.status === 'pending' && !isRecipient && (
          <p className="text-muted text-sm py-6 text-center animate-pulse">
            Request sent — waiting for {candidate.username} to accept...
          </p>
        )}

        {connection.status === 'pending' && isRecipient && (
          <div className="space-y-4">
            <p className="text-muted text-sm">
              {candidate.username} wants to connect. Your real identity stays anonymous until you both agree to share more.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => respond('accepted')}
                className="flex-1 py-2.5 rounded-lg bg-marigold text-ink font-semibold hover:brightness-105"
              >
                Accept
              </button>
              <button
                onClick={() => respond('declined')}
                className="flex-1 py-2.5 rounded-lg bg-surface2 text-offwhite font-semibold hover:bg-surface2/70"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {connection.status === 'declined' && (
          <p className="text-muted text-sm py-6 text-center">This request was declined.</p>
        )}

        {connection.status === 'accepted' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">Give them a nickname (private, only you see it)</label>
              <div className="flex gap-2">
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={candidate.username}
                  className="flex-1 bg-canvas border border-surface2 rounded-lg px-3 py-2 text-sm text-offwhite placeholder:text-muted focus:border-marigold outline-none"
                />
                <button
                  onClick={handleSaveNickname}
                  className="px-3 py-2 rounded-lg bg-surface2 text-offwhite text-sm hover:bg-surface2/70"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="bg-canvas rounded-lg p-3 h-40 overflow-y-auto space-y-2">
              {messages.length === 0 && (
                <p className="text-muted text-sm italic">Say hi — connection accepted!</p>
              )}
              {messages.map((m) => {
                const isMe = m.sender_id === myProfile.id
                const isMeetup = m.body.startsWith('📍')
                return (
                  <div
                    key={m.id}
                    className={`text-sm rounded-lg px-3 py-1.5 w-fit ${isMe ? 'ml-auto' : ''} ${
                      isMeetup ? 'bg-coral/20 text-coral font-medium' : 'bg-marigold/10 text-offwhite'
                    }`}
                  >
                    {m.body}
                  </div>
                )
              })}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-canvas border border-surface2 rounded-lg px-3 py-2 text-sm text-offwhite placeholder:text-muted focus:border-marigold outline-none"
              />
              <button type="submit" className="px-3 py-2 rounded-lg bg-marigold text-ink text-sm font-semibold">
                Send
              </button>
            </form>

            {!showMeetupForm ? (
              <button
                type="button"
                onClick={() => setShowMeetupForm(true)}
                className="w-full py-2 rounded-lg bg-coral/10 text-coral text-sm font-medium hover:bg-coral/20"
              >
                Suggest a meetup →
              </button>
            ) : (
              <form onSubmit={sendMeetupSuggestion} className="space-y-2 bg-canvas rounded-lg p-3">
                <input
                  value={meetup.place}
                  onChange={(e) => setMeetup({ ...meetup, place: e.target.value })}
                  placeholder="Where? e.g. Marrickville Library"
                  className="w-full bg-surface border border-surface2 rounded-lg px-3 py-2 text-sm text-offwhite placeholder:text-muted focus:border-coral outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={meetup.date}
                    onChange={(e) => setMeetup({ ...meetup, date: e.target.value })}
                    className="flex-1 bg-surface border border-surface2 rounded-lg px-3 py-2 text-sm text-offwhite focus:border-coral outline-none"
                  />
                  <input
                    type="time"
                    value={meetup.time}
                    onChange={(e) => setMeetup({ ...meetup, time: e.target.value })}
                    className="flex-1 bg-surface border border-surface2 rounded-lg px-3 py-2 text-sm text-offwhite focus:border-coral outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMeetupForm(false)}
                    className="flex-1 py-2 rounded-lg bg-surface2 text-offwhite text-sm font-medium hover:bg-surface2/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-coral text-ink text-sm font-semibold hover:brightness-105"
                  >
                    Send suggestion
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
