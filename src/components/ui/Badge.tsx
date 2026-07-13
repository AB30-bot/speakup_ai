const TIER_TEXT: Record<'easy' | 'mid' | 'hard', string> = {
  easy: 'text-good',
  mid: 'text-warn',
  hard: 'text-bad',
}

const TIER_DOT: Record<'easy' | 'mid' | 'hard', string> = {
  easy: 'bg-good',
  mid: 'bg-warn',
  hard: 'bg-bad',
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
    <span className={`kicker inline-flex items-center gap-2 ${TIER_TEXT[tier]}`}>
      <span className="flex items-end gap-[3px]" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-sm ${i < difficulty ? TIER_DOT[tier] : 'bg-ink/15'}`}
            style={{ height: `${5 + i * 0.8}px` }}
          />
        ))}
      </span>
      Lv {difficulty} · {label}
    </span>
  )
}
