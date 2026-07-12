import { describe, it, expect, beforeEach } from 'vitest'
import { defaultProfile, loadProfile, saveProfile, loadSessions, saveSession } from './storage'
import type { SessionRecord } from '../types'

beforeEach(() => {
  localStorage.clear()
})

describe('profile storage', () => {
  it('returns a default profile when nothing is stored', () => {
    expect(loadProfile()).toEqual(defaultProfile())
  })
  it('round-trips a saved profile', () => {
    const profile = { ...defaultProfile(), xp: 150, level: 2 }
    saveProfile(profile)
    expect(loadProfile()).toEqual(profile)
  })
})

describe('session storage', () => {
  it('starts empty', () => {
    expect(loadSessions()).toEqual([])
  })
  it('prepends new sessions, newest first', () => {
    saveSession(makeSession('1'))
    const result = saveSession(makeSession('2'))
    expect(result[0].id).toBe('2')
    expect(result[1].id).toBe('1')
  })
  it('caps history at 30 sessions', () => {
    for (let i = 0; i < 35; i++) saveSession(makeSession(String(i)))
    expect(loadSessions().length).toBe(30)
  })
})

function makeSession(id: string): SessionRecord {
  return {
    id,
    scenarioTitle: 'Test',
    scenarioIcon: '🎤',
    transcript: [],
    evaluation: {
      categoryScores: {
        confidence: 80, fluency: 80, clarity: 80, grammar: 80, vocabulary: 80,
        persuasiveness: 80, pace: 80, fillerWords: 80, professionalism: 80,
        structure: 80, emotionalImpact: 80, naturalness: 80,
      },
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
