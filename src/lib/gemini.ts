import type { EvaluationResult, Scenario, TranscriptTurn } from '../types'

async function callProxy(body: unknown): Promise<string> {
  const response = await fetch('/.netlify/functions/gemini-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`Gemini proxy request failed (${response.status})`)
  }
  const data = await response.json()
  return data.text as string
}

export async function sendChatTurn(
  systemPrompt: string,
  history: { role: 'user' | 'model'; text: string }[],
  userMessage: string
): Promise<string> {
  return callProxy({ mode: 'chat', systemPrompt, history, userMessage })
}

export async function evaluateSession(transcript: TranscriptTurn[]): Promise<EvaluationResult> {
  const text = await callProxy({ mode: 'evaluate', transcript })
  return JSON.parse(text) as EvaluationResult
}

export async function generateScenario(
  difficultyLevel: number,
  weakSkills: string[]
): Promise<Partial<Scenario>> {
  const text = await callProxy({ mode: 'generateScenario', difficultyLevel, weakSkills })
  return JSON.parse(text) as Partial<Scenario>
}
