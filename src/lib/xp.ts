export interface LevelInfo {
  level: number
  xpIntoLevel: number
  xpForNextLevel: number
}

const BASE_XP = 200
const GROWTH = 1.25

export function xpRequiredForLevel(level: number): number {
  return Math.round(BASE_XP * Math.pow(GROWTH, level - 1))
}

export function levelFromTotalXp(totalXp: number): LevelInfo {
  let level = 1
  let remaining = totalXp
  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level)
    level += 1
  }
  return { level, xpIntoLevel: remaining, xpForNextLevel: xpRequiredForLevel(level) }
}

export function xpForSession(overallScore: number, difficulty: number): number {
  return Math.round(40 + overallScore * 0.8 + difficulty * 8)
}

export function coinsForSession(overallScore: number): number {
  return Math.round(overallScore * 0.3)
}
