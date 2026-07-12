export function ProgressBar({ percent, colorClass = 'bg-gradient-to-r from-purple to-blue' }: { percent: number; colorClass?: string }) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${clamped}%` }} />
    </div>
  )
}
