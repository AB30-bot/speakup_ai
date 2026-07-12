import { describe, it, expect } from 'vitest'
import { buildGeminiPayload } from './promptBuilders'

describe('buildGeminiPayload', () => {
  it('builds a chat payload with system prompt, history, and latest message in order', () => {
    const payload = buildGeminiPayload({
      mode: 'chat',
      systemPrompt: 'You are a recruiter.',
      history: [
        { role: 'user', text: 'Hi' },
        { role: 'model', text: 'Hello' },
      ],
      userMessage: 'Tell me about yourself',
    })
    expect(payload.contents[0].parts[0].text).toBe('You are a recruiter.')
    expect(payload.contents).toHaveLength(4)
    expect(payload.contents[3].parts[0].text).toBe('Tell me about yourself')
  })

  it('requests JSON output for evaluate mode', () => {
    const payload = buildGeminiPayload({
      mode: 'evaluate',
      transcript: [{ role: 'user', text: 'Hello' }],
    })
    expect(payload.generationConfig?.responseMimeType).toBe('application/json')
    expect(payload.contents[0].parts[0].text).toContain('Hello')
  })

  it('includes weak skills in the scenario generation prompt when present', () => {
    const payload = buildGeminiPayload({
      mode: 'generateScenario',
      difficultyLevel: 12,
      weakSkills: ['pace', 'filler words'],
    })
    expect(payload.contents[0].parts[0].text).toContain('pace, filler words')
    expect(payload.contents[0].parts[0].text).toContain('level 12')
  })
})
