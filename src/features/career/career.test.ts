import { describe, it, expect } from 'vitest'
import { careerStageFor, difficultyDescriptorFor } from './career'

describe('careerStageFor', () => {
  it('returns the authored stage for levels 1-10', () => {
    expect(careerStageFor(1).title).toBe('Talking to a Stranger')
    expect(careerStageFor(10).title).toBe('TED-Style Speech')
  })
  it('procedurally generates a stage beyond level 10', () => {
    const stage = careerStageFor(11)
    expect(stage.level).toBe(11)
    expect(stage.title).toContain('11')
  })
})

describe('difficultyDescriptorFor', () => {
  it('escalates in intensity as level increases', () => {
    expect(difficultyDescriptorFor(1)).toContain('low-pressure')
    expect(difficultyDescriptorFor(10)).toContain('high pressure')
    expect(difficultyDescriptorFor(15)).toContain('tier 5')
  })
})
