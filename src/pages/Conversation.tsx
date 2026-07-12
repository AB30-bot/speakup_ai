import { useLocation, useNavigate } from 'react-router-dom'
import { useConversation } from '../features/conversation/useConversation'
import { VideoCallFrame } from '../features/conversation/scenes/VideoCallFrame'
import { PhoneCallFrame } from '../features/conversation/scenes/PhoneCallFrame'
import { StageFrame } from '../features/conversation/scenes/StageFrame'
import { CasualFrame } from '../features/conversation/scenes/CasualFrame'
import { isSpeechRecognitionSupported } from '../lib/speech'
import type { Scenario } from '../types'

export function Conversation() {
  const location = useLocation()
  const navigate = useNavigate()
  const scenario = (location.state as { scenario?: Scenario } | null)?.scenario

  if (!scenario) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-ink-dim">No scenario selected.</p>
        <button className="btn-primary mt-4" onClick={() => navigate('/scenarios')}>Choose a Scenario</button>
      </main>
    )
  }

  return <ConversationSession scenario={scenario} />
}

function ConversationSession({ scenario }: { scenario: Scenario }) {
  const navigate = useNavigate()
  const { transcript, isListening, isThinking, sendMessage, startListening, stopListening } = useConversation(scenario)
  const speechSupported = isSpeechRecognitionSupported()

  function endSession() {
    navigate('/report', { state: { scenario, transcript } })
  }

  const sceneProps = {
    scenario,
    transcript,
    isThinking,
    isListening,
    speechSupported,
    onSend: sendMessage,
    onStartListening: startListening,
    onStopListening: stopListening,
    onEndSession: endSession,
  }

  switch (scenario.sceneType) {
    case 'videoCall':
      return <VideoCallFrame {...sceneProps} />
    case 'phoneCall':
      return <PhoneCallFrame {...sceneProps} />
    case 'stage':
      return <StageFrame {...sceneProps} />
    default:
      return <CasualFrame {...sceneProps} />
  }
}
