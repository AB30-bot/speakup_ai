import type { Scenario, TranscriptTurn } from '../../../types'

export interface SceneProps {
  scenario: Scenario
  transcript: TranscriptTurn[]
  isThinking: boolean
  isListening: boolean
  speechSupported: boolean
  onSend: (text: string) => void
  onStartListening: () => void
  onStopListening: () => void
  onEndSession: () => void
}
