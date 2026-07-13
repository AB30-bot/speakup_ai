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
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="glass overflow-hidden p-0">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-line bg-cream px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-xl">
                {scenario.icon}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-cream bg-good" title="Online" />
            </div>
            <div>
              <div className="font-display text-[17px] font-semibold leading-tight tracking-tight">{scenario.personaName}</div>
              <div className="text-xs text-ink-faint">
                {isThinking ? <span className="italic">typing…</span> : scenario.personaRole}
              </div>
            </div>
          </div>
          <button className="btn-ghost px-3.5 py-1.5 text-xs" onClick={onEndSession}>End session</button>
        </div>

        {/* Messages */}
        <div className="bg-paper/60 px-5 py-5">
          <TranscriptBubbles transcript={transcript} isThinking={isThinking} personaName={scenario.personaName} />
        </div>

        {/* Composer */}
        <div className="border-t border-line bg-cream px-4 py-3.5">
          <ConversationControls
            speechSupported={speechSupported}
            isListening={isListening}
            onStartListening={onStartListening}
            onStopListening={onStopListening}
            onSend={onSend}
          />
        </div>
      </div>
    </main>
  )
}
