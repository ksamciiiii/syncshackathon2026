// Simple, explainable weighted-tag scoring.
// Deliberately NOT a black box: every match returns the exact reasons it
// scored the way it did, so the UI can show "why" — this is the thing to
// point to in a live demo.

const WEIGHTS = {
  language: 3,
  culture: 2,
  hobby: 2,
  neighborhood: 1,
}

export function scoreMatch(currentUser, candidate) {
  const reasons = []
  let score = 0

  const myTags = currentUser.tags
  const theirTags = candidate.tags

  for (const myTag of myTags) {
    const shared = theirTags.find(
      (t) => t.label.toLowerCase() === myTag.label.toLowerCase() && t.type === myTag.type
    )
    if (shared) {
      const weight = WEIGHTS[myTag.type] ?? 1
      score += weight
      reasons.push({ label: myTag.label, type: myTag.type, weight })
    }
  }

  if (
    currentUser.neighborhood &&
    candidate.neighborhood &&
    currentUser.neighborhood.trim().toLowerCase() === candidate.neighborhood.trim().toLowerCase()
  ) {
    score += WEIGHTS.neighborhood
    reasons.push({ label: candidate.neighborhood, type: 'neighborhood', weight: WEIGHTS.neighborhood })
  }

  return { score, reasons }
}

export function rankMatches(currentUser, candidates) {
  return candidates
    .map((candidate) => ({ candidate, ...scoreMatch(currentUser, candidate) }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
}
