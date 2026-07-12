import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendChatTurn, evaluateSession } from './gemini'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('sendChatTurn', () => {
  it('posts to the proxy and returns the reply text', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Hello there' }),
    }) as unknown as typeof fetch

    const reply = await sendChatTurn('You are a recruiter.', [], 'Hi')
    expect(reply).toBe('Hello there')
    expect(fetch).toHaveBeenCalledWith('/.netlify/functions/gemini-proxy', expect.objectContaining({ method: 'POST' }))
  })

  it('throws when the proxy responds with an error status', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 502 }) as unknown as typeof fetch
    await expect(sendChatTurn('sys', [], 'hi')).rejects.toThrow('502')
  })
})

describe('evaluateSession', () => {
  it('parses the JSON evaluation payload', async () => {
    const fakeEval = {
      categoryScores: {}, categoryReasons: {}, overallScore: 88,
      strengths: [], weaknesses: [], bestSentence: '', summary: '',
    }
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ text: JSON.stringify(fakeEval) }),
    }) as unknown as typeof fetch

    const result = await evaluateSession([{ role: 'user', text: 'hi' }])
    expect(result.overallScore).toBe(88)
  })
})
