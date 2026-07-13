export function ProgressBar({ percent, colorClass }: { percent: number; colorClass?: string }) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div className="xp-track">
      <div className={`xp-fill ${colorClass ?? ''}`} style={{ width: `${clamped}%` }} />
    </div>
  )
}
