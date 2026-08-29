import { useEffect, useState } from 'react'
import { fetchOtherProfiles } from '../lib/db'
import { rankMatches } from '../lib/matching'
import BlockStack from './BlockStack'

export default function MatchFeed({ currentUser, onConnect, onEditProfile }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchOtherProfiles(currentUser.id)
      .then(setProfiles)
      .catch((err) => setError(err.message ?? 'Failed to load matches.'))
      .finally(() => setLoading(false))
  }, [currentUser.id])

  const matches = rankMatches(currentUser, profiles)

  const trimmedQuery = query.trim().toLowerCase()
  const isSearching = trimmedQuery.length > 0
  const searchResults = isSearching
    ? profiles.filter(
        (p) =>
          p.username.toLowerCase().includes(trimmedQuery) ||
          (p.tags ?? []).some((t) => t.label.toLowerCase().includes(trimmedQuery))
      )
    : []

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-offwhite">Your matches</h2>
        <p className="text-muted text-sm mt-1">
          Ranked by shared blocks — language counts most, then culture and hobbies, then neighborhood.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by username or tag..."
        className="w-full bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-offwhite placeholder:text-muted focus:border-marigold outline-none"
      />

      {error && <p className="text-coral text-sm">{error}</p>}
      {loading && <p className="text-muted italic py-8 text-center">Loading matches...</p>}

      {!loading && isSearching && searchResults.length === 0 && (
        <p className="text-muted italic py-8 text-center">No one matches "{query.trim()}".</p>
      )}

      {!loading && !isSearching && matches.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted italic mb-4">
            No matches yet — add more tags to your profile to find people.
          </p>
          {onEditProfile && (
            <button
              onClick={onEditProfile}
              className="px-4 py-2 rounded-lg bg-marigold text-ink text-sm font-semibold hover:brightness-105"
            >
              Add tags to your profile →
            </button>
          )}
        </div>
      )}

      {isSearching ? (
        <div className="grid gap-3">
          {searchResults.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-surface border border-surface2 rounded-xl p-5 hover:border-marigold/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="font-display font-semibold text-offwhite">{candidate.username}</span>
                  <p className="text-sm text-muted mb-3">{candidate.neighborhood}</p>
                  <BlockStack tags={candidate.tags} />
                </div>
                <button
                  onClick={() => onConnect(candidate)}
                  className="shrink-0 px-4 py-2 rounded-lg bg-marigold text-ink text-sm font-semibold hover:brightness-105"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {matches.map(({ candidate, score, reasons }) => (
            <div
              key={candidate.id}
              className="bg-surface border border-surface2 rounded-xl p-5 hover:border-marigold/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-display font-semibold text-offwhite">{candidate.username}</span>
                    <span className="font-mono text-xs text-marigold bg-marigold/10 px-2 py-0.5 rounded">
                      match score {score}
                    </span>
                  </div>
                  <p className="text-sm text-muted mb-3">{candidate.neighborhood}</p>
                  <BlockStack tags={candidate.tags} highlightedLabels={reasons.map((r) => r.label)} />
                  <p className="text-xs font-mono text-muted mt-3">
                    Matched on: {reasons.map((r) => r.label).join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => onConnect(candidate)}
                  className="shrink-0 px-4 py-2 rounded-lg bg-marigold text-ink text-sm font-semibold hover:brightness-105"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
