export function ScoreRing({ score }: { score: number }) {
  return (
    <div
      className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(#8b5cf6 0% ${score}%, rgba(255,255,255,0.08) ${score}% 100%)` }}
    >
      <div className="absolute inset-3 rounded-full bg-surface" />
      <div className="relative z-10 text-center">
        <b className="block font-display text-4xl font-extrabold">{score}</b>
        <span className="text-xs uppercase tracking-wide text-ink-dim">Overall Score</span>
      </div>
    </div>
  )
}
