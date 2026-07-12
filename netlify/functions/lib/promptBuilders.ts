export interface ChatTurn {
  role: 'user' | 'model'
  text: string
}

export interface TranscriptTurn {
  role: 'ai' | 'user'
  text: string
}

export interface ChatRequestBody {
  mode: 'chat'
  systemPrompt: string
  history: ChatTurn[]
  userMessage: string
}

export interface EvaluateRequestBody {
  mode: 'evaluate'
  transcript: TranscriptTurn[]
}

export interface GenerateScenarioRequestBody {
  mode: 'generateScenario'
  difficultyLevel: number
  weakSkills: string[]
}

export type ProxyRequestBody = ChatRequestBody | EvaluateRequestBody | GenerateScenarioRequestBody

interface GeminiPart {
  text: string
}
interface GeminiContent {
  role: string
  parts: GeminiPart[]
}
interface GeminiPayload {
  contents: GeminiContent[]
  generationConfig?: { responseMimeType: string }
}

export function buildGeminiPayload(body: ProxyRequestBody): GeminiPayload {
  if (body.mode === 'chat') {
    return {
      contents: [
        { role: 'user', parts: [{ text: body.systemPrompt }] },
        ...body.history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: body.userMessage }] },
      ],
    }
  }
  if (body.mode === 'evaluate') {
    const transcriptText = body.transcript.map(t => `${t.role === 'ai' ? 'AI' : 'User'}: ${t.text}`).join('\n')
    return {
      contents: [{ role: 'user', parts: [{ text: buildEvaluationPrompt(transcriptText) }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }
  }
  return {
    contents: [{ role: 'user', parts: [{ text: buildScenarioPrompt(body.difficultyLevel, body.weakSkills) }] }],
    generationConfig: { responseMimeType: 'application/json' },
  }
}

function buildEvaluationPrompt(transcriptText: string): string {
  return `You are an expert public speaking coach. Evaluate this conversation transcript.\n\n${transcriptText}\n\nReturn ONLY JSON matching this shape: {"categoryScores": {"confidence": number 0-100, "fluency": number, "clarity": number, "grammar": number, "vocabulary": number, "persuasiveness": number, "pace": number, "fillerWords": number, "professionalism": number, "structure": number, "emotionalImpact": number, "naturalness": number}, "categoryReasons": {<same keys, one-sentence why>}, "overallScore": number 0-100, "strengths": string[], "weaknesses": string[], "bestSentence": string, "summary": string}`
}

function buildScenarioPrompt(difficultyLevel: number, weakSkills: string[]): string {
  const focus = weakSkills.length ? ` The user recently struggled with: ${weakSkills.join(', ')}.` : ''
  return `Generate a public-speaking practice scenario for career-mode level ${difficultyLevel} (higher = harder: more pressure, hostility, interruptions, stakes).${focus} Also pick the best-fitting visual setting for this scenario. Return ONLY JSON matching: {"title": string, "personaName": string, "personaRole": string, "mood": string, "objective": string, "twist": string, "systemPrompt": string describing how the AI should roleplay this persona, "sceneType": one of "videoCall" (a remote video meeting, e.g. interviews/pitches), "stage" (public speaking to an audience or a formal debate), "phoneCall" (a voice-only call, e.g. an upset customer), "casual" (an in-person casual conversation), "stageVariant": only if sceneType is "stage", one of "audience" (speaking to a crowd) or "podiumSplit" (a face-off debate)}`
}
