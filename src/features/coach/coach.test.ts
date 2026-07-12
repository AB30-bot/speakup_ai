import { describe, it, expect } from 'vitest'
import { weakestCategory, coachMessage } from './coach'
import type { SessionRecord, CategoryScores } from '../../types'

describe('weakestCategory', () => {
  it('returns null with no sessions', () => {
    expect(weakestCategory([])).toBeNull()
  })
  it('picks the category with the lowest average score', () => {
    const sessions = [makeSession({ pace: 40 }), makeSession({ pace: 45 })]
    const weak = weakestCategory(sessions)
    expect(weak?.key).toBe('pace')
    expect(weak?.average).toBe(43)
  })
})

describe('coachMessage', () => {
  it('prompts for a first session when there is no history', () => {
    expect(coachMessage([])).toContain('first session')
  })
  it('names the weakest skill', () => {
    expect(coachMessage([makeSession({ pace: 40 })])).toContain('speaking pace')
  })
})

function makeSession(overrides: Partial<CategoryScores>): SessionRecord {
  const base: CategoryScores = {
    confidence: 80, fluency: 80, clarity: 80, grammar: 80, vocabulary: 80,
    persuasiveness: 80, pace: 80, fillerWords: 80, professionalism: 80,
    structure: 80, emotionalImpact: 80, naturalness: 80,
  }
  return {
    id: '1',
    scenarioTitle: 't',
    scenarioIcon: '🎤',
    transcript: [],
    evaluation: {
      categoryScores: { ...base, ...overrides },
      categoryReasons: {},
      overallScore: 80,
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
