import { useEffect, useState } from 'react'
import { fetchOtherProfiles, fetchNeedPosts, postNeed as postNeedToDb } from '../lib/db'
import { formatSkills } from '../lib/skills'

export default function TeachLearnBoard({ currentUser, onConnect }) {
  const [needText, setNeedText] = useState('')
  const [posts, setPosts] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([fetchOtherProfiles(currentUser.id), fetchNeedPosts()])
      .then(([otherProfiles, needPosts]) => {
        setProfiles(otherProfiles)
        setPosts(needPosts)
      })
      .catch((err) => setError(err.message ?? 'Failed to load the board.'))
      .finally(() => setLoading(false))
  }, [currentUser.id])

  async function handlePostNeed(e) {
    e.preventDefault()
    if (!needText.trim()) return
    try {
      const post = await postNeedToDb(currentUser.id, needText.trim())
      setPosts([post, ...posts])
      setNeedText('')
    } catch (err) {
      setError(err.message ?? 'Failed to post.')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-offwhite">Teach & learn</h2>
        <p className="text-muted text-sm mt-1">
          Informal, no-pressure skill trades — teach what you know, learn what you're curious about.
        </p>
      </div>

      {error && <p className="text-coral text-sm">{error}</p>}
      {loading && <p className="text-muted italic py-8 text-center">Loading...</p>}

      <div className="grid gap-3">
        {profiles.map((u) => {
          const { offering, seeking } = formatSkills(u.skills)
          if (!offering && !seeking) return null
          return (
            <div key={u.id} className="bg-surface border border-surface2 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-display font-semibold text-offwhite">{u.username}</span>
                  {offering && <p className="text-sm text-marigold mt-1">{offering}</p>}
                  {seeking && <p className="text-sm text-coral mt-1">{seeking}</p>}
                </div>
                <button
                  onClick={() => onConnect(u)}
                  className="shrink-0 px-4 py-2 rounded-lg bg-surface2 text-offwhite text-sm font-semibold hover:bg-surface2/70"
                >
                  Reach out
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-4 border-t border-surface2">
        <h3 className="font-display text-xl font-semibold text-offwhite mb-1">Post a need</h3>
        <p className="text-muted text-sm mb-4">
          Say what you actually miss or want — matched to someone with that specific experience,
          not a generic interest.
        </p>
        <form onSubmit={handlePostNeed} className="flex gap-2 mb-6">
          <input
            value={needText}
            onChange={(e) => setNeedText(e.target.value)}
            placeholder="e.g. I miss cooking with my mom..."
            className="flex-1 bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-offwhite placeholder:text-muted focus:border-coral outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-coral text-ink font-semibold hover:brightness-105"
          >
            Post
          </button>
        </form>

        <div className="grid gap-3">
          {posts.map((p) => (
            <div key={p.id} className="bg-surface border border-coral/20 rounded-xl p-5">
              <p className="text-offwhite">{p.need_text}</p>
              <p className="font-mono text-xs text-muted mt-3">— {p.profiles?.username ?? 'unknown'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
