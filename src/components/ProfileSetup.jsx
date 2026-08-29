import { useState } from 'react'
import BlockStack from './BlockStack'

const TAG_TYPES = [
  { key: 'hobby', label: 'Hobby' },
  { key: 'culture', label: 'Culture' },
  { key: 'language', label: 'Language' },
]

export default function ProfileSetup({ onComplete }) {
  const [username, setUsername] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [tagType, setTagType] = useState('hobby')

  function addTag() {
    const label = tagInput.trim()
    if (!label) return
    setTags([...tags, { label, type: tagType }])
    setTagInput('')
  }

  function removeTag(index) {
    setTags(tags.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || tags.length === 0) return
    onComplete({ username: username.trim(), neighborhood: neighborhood.trim(), tags })
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-14">
      <p className="font-mono text-xs text-marigold tracking-widest uppercase mb-3">Step 1</p>
      <h1 className="font-display text-3xl font-semibold text-offwhite mb-2">
        Build your block signature
      </h1>
      <p className="text-muted mb-8">
        No real name needed. Just what you're into, where you're from, and where you're at.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-offwhite mb-1.5">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. quiet_comet"
            className="w-full bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-offwhite placeholder:text-muted focus:border-marigold outline-none"
          />
        </div>

        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium text-offwhite mb-1.5">
            Neighborhood <span className="text-muted font-normal">(rough area, not exact address)</span>
          </label>
          <input
            id="neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="e.g. Marrickville"
            className="w-full bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-offwhite placeholder:text-muted focus:border-marigold outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-offwhite mb-1.5">Add tags</label>
          <div className="flex gap-2 mb-2">
            {TAG_TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTagType(t.key)}
                className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
                  tagType === t.key
                    ? 'bg-marigold text-ink border-marigold'
                    : 'border-surface2 text-muted hover:border-muted'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="e.g. Filipino, Tagalog, board games..."
              className="flex-1 bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-offwhite placeholder:text-muted focus:border-marigold outline-none"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2.5 rounded-lg bg-surface2 text-offwhite font-medium hover:bg-surface2/70"
            >
              Add
            </button>
          </div>
        </div>

        {tags.length > 0 && (
          <div>
            <p className="text-sm text-muted mb-2">Your signature so far:</p>
            <BlockStack tags={tags} />
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => removeTag(i)}
                  className="text-xs font-mono px-2 py-1 rounded bg-surface2 text-muted hover:text-offwhite"
                >
                  {t.label} ✕
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!username.trim() || tags.length === 0}
          className="w-full py-3 rounded-lg bg-marigold text-ink font-display font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition"
        >
          Enter Blocks
        </button>
      </form>
    </div>
  )
}
