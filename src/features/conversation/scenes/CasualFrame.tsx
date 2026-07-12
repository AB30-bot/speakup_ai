import { GlassCard } from '../../../components/ui/GlassCard'
import { TranscriptBubbles } from './TranscriptBubbles'
import { ConversationControls } from './ConversationControls'
import type { SceneProps } from './SceneProps'

export function CasualFrame({
  scenario,
  transcript,
  isThinking,
  isListening,
  speechSupported,
  onSend,
  onStartListening,
  onStopListening,
  onEndSession,
}: SceneProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <GlassCard>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-blue text-xl">
              {scenario.icon}
            </div>
            <div>
              <div className="font-display font-bold">{scenario.personaName}</div>
              <div className="text-xs text-ink-dim">{scenario.personaRole}</div>
            </div>
          </div>
          <button className="btn-ghost" onClick={onEndSession}>End Session</button>
        </div>

        <TranscriptBubbles transcript={transcript} isThinking={isThinking} personaName={scenario.personaName} />

        <div className="mt-4">
          <ConversationControls
            speechSupported={speechSupported}
            isListening={isListening}
            onStartListening={onStartListening}
            onStopListening={onStopListening}
            onSend={onSend}
          />
        </div>
      </GlassCard>
    </main>
  )
}
