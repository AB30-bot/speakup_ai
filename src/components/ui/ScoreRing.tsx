export function ScoreRing({ score }: { score: number }) {
  return (
    <div
      className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(var(--color-accent) 0% ${score}%, rgba(34,28,18,0.1) ${score}% 100%)`,
      }}
    >
      <div className="absolute inset-[10px] rounded-full border border-line bg-cream shadow-[inset_0_1px_3px_rgba(34,28,18,0.08)]" />
      <div className="relative z-10 text-center">
        <b className="block font-display text-5xl font-bold tracking-tight">{score}</b>
        <span className="kicker text-ink-faint">Overall</span>
      </div>
    </div>
  )
}
