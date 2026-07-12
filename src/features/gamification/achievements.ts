import type { UserProfile, SessionRecord } from '../../types'

export interface Achievement {
  id: string
  title: string
  icon: string
  check: (profile: UserProfile, sessions: SessionRecord[]) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-session', title: 'First Win', icon: '🏆', check: (_p, sessions) => sessions.length >= 1 },
  { id: 'streak-7', title: '7-Day Streak', icon: '🔥', check: (profile) => profile.streakCount >= 7 },
  { id: 'sharp-shooter', title: 'Sharp Shooter', icon: '🎯', check: (_p, sessions) => sessions.some(s => s.evaluation.overallScore >= 90) },
  { id: 'level-10', title: 'Level 10', icon: '👑', check: (profile) => profile.level >= 10 },
  { id: 'perfect-100', title: 'Perfect 100', icon: '🌟', check: (_p, sessions) => sessions.some(s => s.evaluation.overallScore === 100) },
]

export function newlyUnlockedAchievements(profile: UserProfile, sessions: SessionRecord[]): string[] {
  return ACHIEVEMENTS
    .filter(a => !profile.unlockedAchievements.includes(a.id))
    .filter(a => a.check(profile, sessions))
    .map(a => a.id)
}
