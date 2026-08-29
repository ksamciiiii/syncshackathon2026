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
