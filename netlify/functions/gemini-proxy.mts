import { buildGeminiPayload, type ProxyRequestBody } from './lib/promptBuilders'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

interface NetlifyEvent {
  httpMethod: string
  body: string | null
}

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server missing GEMINI_API_KEY' }) }
  }

  let body: ProxyRequestBody
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  const payload = buildGeminiPayload(body)

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errText = await response.text()
    return { statusCode: 502, body: JSON.stringify({ error: 'Gemini request failed', detail: errText }) }
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return { statusCode: 200, body: JSON.stringify({ text }) }
}
