import { useEffect, useState } from 'react'
import { fetchMyConnections, subscribeToMyConnections } from '../lib/db'

const STATUS_LABEL = {
  accepted: 'Connected',
  pending: 'Pending',
  declined: 'Declined',
}

export default function Contacts({ currentUser, onOpen }) {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function load() {
    return fetchMyConnections(currentUser.id)
      .then(setConnections)
      .catch((err) => setError(err.message ?? 'Failed to load contacts.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const unsubscribe = subscribeToMyConnections(currentUser.id, load)
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id])

  const rows = connections.map((c) => {
    const isRequester = c.requester_id === currentUser.id
    const other = isRequester ? c.recipient : c.requester
    const displayName = isRequester && c.nickname ? c.nickname : other.username
    const waitingOnThem = c.status === 'pending' && isRequester
    const needsMyResponse = c.status === 'pending' && !isRequester
    return { connection: c, other, displayName, waitingOnThem, needsMyResponse }
  })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-offwhite">Your contacts</h2>
        <p className="text-muted text-sm mt-1">
          Everyone you've reached out to or heard from — pick up the conversation any time.
        </p>
      </div>

      {error && <p className="text-coral text-sm">{error}</p>}
      {loading && <p className="text-muted italic py-8 text-center">Loading...</p>}

      {!loading && rows.length === 0 && (
        <p className="text-muted italic py-8 text-center">
          No contacts yet — connect with someone from Matches or Teach & Learn to start.
        </p>
      )}

      <div className="grid gap-3">
        {rows.map(({ connection, other, displayName, waitingOnThem, needsMyResponse }) => (
          <div
            key={connection.id}
            className="bg-surface border border-surface2 rounded-xl p-5 flex items-center justify-between gap-4"
          >
            <div>
              <span className="font-display font-semibold text-offwhite">{displayName}</span>
              <p className="text-xs font-mono text-muted mt-1">
                {needsMyResponse ? 'Wants to connect' : waitingOnThem ? 'Waiting for reply' : STATUS_LABEL[connection.status]}
              </p>
            </div>
            <button
              onClick={() => onOpen({ candidate: other, connection })}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold ${
                needsMyResponse
                  ? 'bg-marigold text-ink hover:brightness-105'
                  : connection.status === 'accepted'
                  ? 'bg-surface2 text-offwhite hover:bg-surface2/70'
                  : 'bg-surface2 text-muted hover:text-offwhite'
              }`}
            >
              {needsMyResponse ? 'Respond' : connection.status === 'accepted' ? 'Message' : 'View'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
