import { TAG_COLORS } from '../data/mockData'

// Renders a person's tags as a literal stack of colored blocks — their
// "signature." Highlighted tags (matched ones) get a glow + label.
export default function BlockStack({ tags, highlightedLabels = [], size = 'md' }) {
  const dims = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'
  const normalizedHighlights = highlightedLabels.map((l) => l.toLowerCase())

  return (
    <div className="flex flex-wrap gap-1.5" role="img" aria-label={`Tags: ${tags.map((t) => t.label).join(', ')}`}>
      {tags.map((tag, i) => {
        const isHighlighted = normalizedHighlights.includes(tag.label.toLowerCase())
        return (
          <div
            key={i}
            title={tag.label}
            className={`${dims} rounded-[3px] flex items-center justify-center transition-transform ${
              isHighlighted ? 'ring-2 ring-offset-2 ring-offset-surface ring-white/70 scale-110' : ''
            }`}
            style={{ backgroundColor: TAG_COLORS[tag.type] ?? '#666' }}
          />
        )
      })}
    </div>
  )
}
