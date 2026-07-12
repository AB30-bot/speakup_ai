import { GlassCard } from '../../../components/ui/GlassCard'
import { TranscriptBubbles } from './TranscriptBubbles'
import { ConversationControls } from './ConversationControls'
import type { SceneProps } from './SceneProps'

export function PhoneCallFrame({
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
    <main className="mx-auto max-w-md px-6 py-10 text-center">
      <div
        className={`mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-bad/40 to-warn/30 text-5xl shadow-2xl ${
          isThinking ? 'animate-pulse' : ''
        }`}
      >
        {scenario.icon}
      </div>
      <div className="font-display text-xl font-bold">{scenario.personaName}</div>
      <div className="mb-1 text-sm text-ink-dim">{scenario.personaRole}</div>
      <div className="mb-6 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-bad">
        <span className="h-2 w-2 animate-pulse rounded-full bg-bad" /> Call in progress
      </div>

      <GlassCard className="text-left">
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

      <button className="btn-ghost mt-4 text-bad" onClick={onEndSession}>📞 End Call</button>
    </main>
  )
}
