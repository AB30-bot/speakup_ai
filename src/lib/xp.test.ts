import { describe, it, expect } from 'vitest'
import { xpRequiredForLevel, levelFromTotalXp, xpForSession, coinsForSession } from './xp'

describe('xpRequiredForLevel', () => {
  it('returns 200 for level 1', () => {
    expect(xpRequiredForLevel(1)).toBe(200)
  })
  it('grows for higher levels', () => {
    expect(xpRequiredForLevel(2)).toBeGreaterThan(xpRequiredForLevel(1))
  })
})

describe('levelFromTotalXp', () => {
  it('stays level 1 with 0 xp', () => {
    const info = levelFromTotalXp(0)
    expect(info.level).toBe(1)
    expect(info.xpIntoLevel).toBe(0)
  })
  it('advances to level 2 after crossing the level-1 threshold', () => {
    const info = levelFromTotalXp(200)
    expect(info.level).toBe(2)
    expect(info.xpIntoLevel).toBe(0)
  })
  it('keeps partial progress into the current level', () => {
    const info = levelFromTotalXp(250)
    expect(info.level).toBe(2)
    expect(info.xpIntoLevel).toBe(50)
  })
})

describe('xpForSession', () => {
  it('scales with score and difficulty', () => {
    const low = xpForSession(50, 1)
    const high = xpForSession(90, 8)
    expect(high).toBeGreaterThan(low)
  })
})

describe('coinsForSession', () => {
  it('is proportional to score', () => {
    expect(coinsForSession(100)).toBe(30)
    expect(coinsForSession(0)).toBe(0)
  })
})
