import { useState } from 'react'
import BlockStack from './BlockStack'
import ProfileSetup from './ProfileSetup'
import { SKILL_LEVELS } from '../lib/skills'

export default function ProfileView({ currentUser, onUpdate }) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <ProfileSetup
        mode="edit"
        initialData={currentUser}
        onCancel={() => setEditing(false)}
        onComplete={(updated) => {
          onUpdate(updated)
          setEditing(false)
        }}
      />
    )
  }

  const teachSkills = (currentUser.skills ?? []).filter((s) => s.direction === 'teach')
  const learnSkills = (currentUser.skills ?? []).filter((s) => s.direction === 'learn')

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-offwhite">{currentUser.username}</h2>
          <p className="text-muted text-sm mt-1">{currentUser.neighborhood || 'No neighborhood set'}</p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="shrink-0 px-4 py-2 rounded-lg bg-marigold text-ink text-sm font-semibold hover:brightness-105"
        >
          Edit profile
        </button>
      </div>

      <div>
        <p className="text-sm text-muted mb-2">Your signature</p>
        <BlockStack tags={currentUser.tags ?? []} />
      </div>

      <div className="bg-surface border border-surface2 rounded-xl p-5 space-y-4">
        <div>
          <p className="text-xs font-mono text-marigold mb-1.5">Can teach</p>
          {teachSkills.length === 0 ? (
            <p className="text-muted text-sm italic">Nothing added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {teachSkills.map((s, i) => (
                <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-surface2 text-offwhite">
                  {s.label} · {SKILL_LEVELS.find((l) => l.key === s.level)?.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-mono text-coral mb-1.5">Want to learn</p>
          {learnSkills.length === 0 ? (
            <p className="text-muted text-sm italic">Nothing added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {learnSkills.map((s, i) => (
                <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-surface2 text-offwhite">
                  {s.label} · {SKILL_LEVELS.find((l) => l.key === s.level)?.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
