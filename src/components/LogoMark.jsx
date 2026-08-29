// The app's mark, literalizing its own visual language: a person's tags
// render as stacked color blocks (see BlockStack) — this is that idea
// distilled into three overlapping blocks in the app's tag colors.
export default function LogoMark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <rect x="28" y="24" width="44" height="44" rx="9" fill="#FF6F61" transform="rotate(-10 50 46)" />
      <rect x="48" y="36" width="44" height="44" rx="9" fill="#F2A93B" transform="rotate(8 70 58)" />
      <rect x="34" y="54" width="44" height="44" rx="9" fill="#5EC8D8" transform="rotate(-6 56 76)" />
    </svg>
  )
}
