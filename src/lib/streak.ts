function dayDiff(a: Date, b: Date): number {
  const da = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const db = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((db - da) / 86400000)
}

export function nextStreak(currentStreak: number, lastSessionAt: string | null, now: Date): number {
  if (!lastSessionAt) return 1
  const diff = dayDiff(new Date(lastSessionAt), now)
  if (diff === 0) return currentStreak || 1
  if (diff === 1) return (currentStreak || 0) + 1
  return 1
}
