import type { SessionRecord, CategoryScores } from '../../types'

const CATEGORY_LABELS: Record<keyof CategoryScores, string> = {
  confidence: 'confidence',
  fluency: 'fluency',
  clarity: 'clarity',
  grammar: 'grammar',
  vocabulary: 'vocabulary',
  persuasiveness: 'persuasiveness',
  pace: 'speaking pace',
  fillerWords: 'filler words',
  professionalism: 'professionalism',
  structure: 'structure',
  emotionalImpact: 'emotional impact',
  naturalness: 'naturalness',
}

export interface WeakestCategory {
  key: keyof CategoryScores
  label: string
  average: number
}

export function weakestCategory(sessions: SessionRecord[], sampleSize = 5): WeakestCategory | null {
  const recent = sessions.slice(0, sampleSize)
  if (recent.length === 0) return null

  const keys = Object.keys(CATEGORY_LABELS) as (keyof CategoryScores)[]
  let weakestKey = keys[0]
  let weakestAvg = Infinity
  for (const key of keys) {
    const values = recent.map(s => s.evaluation.categoryScores[key]).filter(v => typeof v === 'number')
    if (values.length === 0) continue
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    if (avg < weakestAvg) {
      weakestAvg = avg
      weakestKey = key
    }
  }
  return { key: weakestKey, label: CATEGORY_LABELS[weakestKey], average: Math.round(weakestAvg) }
}

export function coachMessage(sessions: SessionRecord[]): string {
  const weak = weakestCategory(sessions)
  if (!weak) return 'Complete your first session to unlock personalized coaching.'
  return `Your biggest opportunity right now is ${weak.label} (averaging ${weak.average}/100 over your last sessions) — try a scenario that pushes on that skill next.`
}
