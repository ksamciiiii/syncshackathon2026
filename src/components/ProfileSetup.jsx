import { useState } from 'react'
import BlockStack from './BlockStack'
import { SKILL_LEVELS, SKILL_DIRECTIONS } from '../lib/skills'

const TAG_TYPES = [
  { key: 'hobby', label: 'Hobby' },
  { key: 'culture', label: 'Culture' },
  { key: 'language', label: 'Language' },
]

// Used for both first-time onboarding and editing an existing profile —
// pass `initialData` + mode="edit" to pre-fill and change the submit label.
export default function ProfileSetup({ onComplete, onCancel, initialData = null, mode = 'create' }) {
  const [username, setUsername] = useState(initialData?.username ?? '')
  const [neighborhood, setNeighborhood] = useState(initialData?.neighborhood ?? '')
  const [tags, setTags] = useState(initialData?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [tagType, setTagType] = useState('hobby')

  const [skills, setSkills] = useState(initialData?.skills ?? [])
  const [skillInput, setSkillInput] = useState('')
  const [skillDirection, setSkillDirection] = useState('teach')
  const [skillLevel, setSkillLevel] = useState('beginner')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function addTag() {
    const label = tagInput.trim()
    if (!label) return
    const isDuplicate = tags.some(
      (t) => t.type === tagType && t.label.toLowerCase() === label.toLowerCase()
    )
    if (isDuplicate) {
      setTagInput('')
      return
    }
    setTags([...tags, { label, type: tagType }])
    setTagInput('')
  }

  function removeTag(index) {
    setTags(tags.filter((_, i) => i !== index))
  }

  function addSkill() {
    const label = skillInput.trim()
    if (!label) return
    const isDuplicate = skills.some(
      (s) => s.direction === skillDirection && s.label.toLowerCase() === label.toLowerCase()
    )
    if (isDuplicate) {
      setSkillInput('')
      return
    }
    setSkills([...skills, { label, direction: skillDirection, level: skillLevel }])
    setSkillInput('')
  }

  function removeSkill(index) {
    setSkills(skills.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || tags.length === 0) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await onComplete({
        ...initialData,
        username: username.trim(),
        neighborhood: neighborhood.trim(),
        tags,
        skills,
      })
    } catch (err) {
      setSubmitError(err.message ?? 'Something went wrong — try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const teachSkills = skills.filter((s) => s.direction === 'teach')
  const learnSkills = skills.filter((s) => s.direction === 'learn')

  return (
    <div className="max-w-lg mx-auto px-6 py-14">
      {mode === 'create' && (
        <p className="font-mono text-xs text-marigold tracking-widest uppercase mb-3">Step 1</p>
      )}
      <h1 className="font-display text-3xl font-semibold text-offwhite mb-2">
        {mode === 'edit' ? 'Edit your block signature' : 'Build your block signature'}
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

        <div className="pt-2 border-t border-surface2">
          <label className="block text-sm font-medium text-offwhite mb-1.5 mt-4">
            Skills <span className="text-muted font-normal">(what you can teach, what you want to learn)</span>
          </label>

          <div className="flex gap-2 mb-2">
            {SKILL_DIRECTIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setSkillDirection(d.key)}
                className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
                  skillDirection === d.key
                    ? 'bg-coral text-ink border-coral'
                    : 'border-surface2 text-muted hover:border-muted'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-2">
            {SKILL_LEVELS.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => setSkillLevel(l.key)}
                className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
                  skillLevel === l.key
                    ? 'bg-surface2 text-offwhite border-muted'
                    : 'border-surface2 text-muted hover:border-muted'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="e.g. guitar basics, adobo recipes..."
              className="flex-1 bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-offwhite placeholder:text-muted focus:border-coral outline-none"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2.5 rounded-lg bg-surface2 text-offwhite font-medium hover:bg-surface2/70"
            >
              Add
            </button>
          </div>

          {skills.length > 0 && (
            <div className="mt-3 space-y-3">
              {teachSkills.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-marigold mb-1.5">Can teach</p>
                  <div className="flex flex-wrap gap-2">
                    {teachSkills.map((s) => {
                      const i = skills.indexOf(s)
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => removeSkill(i)}
                          className="text-xs font-mono px-2 py-1 rounded bg-surface2 text-muted hover:text-offwhite"
                        >
                          {s.label} · {SKILL_LEVELS.find((l) => l.key === s.level)?.label} ✕
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              {learnSkills.length > 0 && (
                <div>
                  <p className="text-xs font-mono text-coral mb-1.5">Want to learn</p>
                  <div className="flex flex-wrap gap-2">
                    {learnSkills.map((s) => {
                      const i = skills.indexOf(s)
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => removeSkill(i)}
                          className="text-xs font-mono px-2 py-1 rounded bg-surface2 text-muted hover:text-offwhite"
                        >
                          {s.label} · {SKILL_LEVELS.find((l) => l.key === s.level)?.label} ✕
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {submitError && <p className="text-coral text-sm">{submitError}</p>}

        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 py-3 rounded-lg bg-surface2 text-offwhite font-display font-semibold hover:bg-surface2/70 transition disabled:opacity-40"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!username.trim() || tags.length === 0 || submitting}
            className="flex-1 py-3 rounded-lg bg-marigold text-ink font-display font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition"
          >
            {submitting ? 'Saving...' : mode === 'edit' ? 'Save changes' : 'Enter Blocks'}
          </button>
        </div>
      </form>
    </div>
  )
}
