import { describe, it, expect } from 'vitest'
import { newlyUnlockedAchievements } from './achievements'
import { defaultProfile } from '../../lib/storage'
import type { SessionRecord } from '../../types'

describe('newlyUnlockedAchievements', () => {
  it('unlocks "First Win" after the first session', () => {
    const profile = defaultProfile()
    const unlocked = newlyUnlockedAchievements(profile, [makeSession(80)])
    expect(unlocked).toContain('first-session')
  })
  it('does not re-unlock an already-unlocked achievement', () => {
    const profile = { ...defaultProfile(), unlockedAchievements: ['first-session'] }
    expect(newlyUnlockedAchievements(profile, [makeSession(80)])).not.toContain('first-session')
  })
  it('unlocks "Sharp Shooter" once a session scores 90+', () => {
    const profile = defaultProfile()
    expect(newlyUnlockedAchievements(profile, [makeSession(93)])).toContain('sharp-shooter')
  })
})

function makeSession(overallScore: number): SessionRecord {
  return {
    id: '1',
    scenarioTitle: 't',
    scenarioIcon: '🎤',
    transcript: [],
    evaluation: {
      categoryScores: {
        confidence: 80, fluency: 80, clarity: 80, grammar: 80, vocabulary: 80,
        persuasiveness: 80, pace: 80, fillerWords: 80, professionalism: 80,
        structure: 80, emotionalImpact: 80, naturalness: 80,
      },
      categoryReasons: {},
      overallScore,
      strengths: [],
      weaknesses: [],
      bestSentence: '',
      summary: '',
    },
    xpEarned: 10,
    coinsEarned: 3,
    timestamp: new Date().toISOString(),
  }
}
