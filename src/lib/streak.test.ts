import { describe, it, expect } from 'vitest'
import { nextStreak } from './streak'

describe('nextStreak', () => {
  it('starts at 1 when there is no previous session', () => {
    expect(nextStreak(0, null, new Date('2026-07-11'))).toBe(1)
  })
  it('stays the same when the previous session was earlier today', () => {
    expect(nextStreak(3, '2026-07-11T08:00:00.000Z', new Date('2026-07-11T20:00:00.000Z'))).toBe(3)
  })
  it('increments when the previous session was exactly one day earlier', () => {
    expect(nextStreak(3, '2026-07-10T08:00:00.000Z', new Date('2026-07-11T08:00:00.000Z'))).toBe(4)
  })
  it('resets to 1 when more than one day has passed', () => {
    expect(nextStreak(5, '2026-07-01T08:00:00.000Z', new Date('2026-07-11T08:00:00.000Z'))).toBe(1)
  })
})
