const TIER_CLASSES: Record<'easy' | 'mid' | 'hard', string> = {
  easy: 'bg-good/15 text-good',
  mid: 'bg-warn/15 text-warn',
  hard: 'bg-bad/15 text-bad',
}

export function tierForDifficulty(difficulty: number): 'easy' | 'mid' | 'hard' {
  if (difficulty <= 3) return 'easy'
  if (difficulty <= 7) return 'mid'
  return 'hard'
}

export function DifficultyBadge({ difficulty }: { difficulty: number }) {
  const tier = tierForDifficulty(difficulty)
  const label = tier === 'easy' ? 'Easy' : tier === 'mid' ? 'Medium' : 'Hard'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${TIER_CLASSES[tier]}`}>
      Level {difficulty} · {label}
    </span>
  )
}
