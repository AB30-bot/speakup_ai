import { useCallback, useRef, useState } from 'react'
import type { Scenario, TranscriptTurn } from '../../types'
import { sendChatTurn } from '../../lib/gemini'
import { createRecognizer, isSpeechRecognitionSupported, speak } from '../../lib/speech'

export function useConversation(scenario: Scenario) {
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([{ role: 'ai', text: scenario.objective }])
  const [isListening, setIsListening] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const recognizerRef = useRef<any>(null)

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      setTranscript(prev => [...prev, { role: 'user', text }])
      setIsThinking(true)
      const history = transcript.map(t => ({ role: (t.role === 'ai' ? 'model' : 'user') as 'model' | 'user', text: t.text }))
      try {
        let reply: string
        try {
          reply = await sendChatTurn(scenario.systemPrompt, history, text)
        } catch {
          reply = await sendChatTurn(scenario.systemPrompt, history, text)
        }
        setTranscript(prev => [...prev, { role: 'ai', text: reply }])
        speak(reply)
      } catch {
        setTranscript(prev => [...prev, { role: 'ai', text: 'Sorry, I lost connection for a moment. Could you say that again?' }])
      } finally {
        setIsThinking(false)
      }
    },
    [scenario, transcript]
  )

  const startListening = useCallback(() => {
    if (!isSpeechRecognitionSupported()) return
    const recognizer = createRecognizer({
      onResult: (text, isFinal) => {
        if (isFinal) sendMessage(text)
      },
      onEnd: () => setIsListening(false),
      onError: () => setIsListening(false),
    })
    recognizerRef.current = recognizer
    recognizer.start()
    setIsListening(true)
  }, [sendMessage])

  const stopListening = useCallback(() => {
    recognizerRef.current?.stop()
    setIsListening(false)
  }, [])

  return { transcript, isListening, isThinking, sendMessage, startListening, stopListening }
}
