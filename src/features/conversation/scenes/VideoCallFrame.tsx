import { GlassCard } from '../../../components/ui/GlassCard'
import { TranscriptBubbles } from './TranscriptBubbles'
import { ConversationControls } from './ConversationControls'
import type { SceneProps } from './SceneProps'

export function VideoCallFrame({
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
  const lastAiLine = [...transcript].reverse().find(t => t.role === 'ai')?.text
  const lastUserLine = [...transcript].reverse().find(t => t.role === 'user')?.text

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-bad">
          <span className="h-2 w-2 animate-pulse rounded-full bg-bad" /> Live
        </div>
        <button className="btn-ghost text-xs" onClick={onEndSession}>📞 End Call</button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-purple/15 to-blue/10 p-6">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple to-blue text-4xl shadow-xl ${
              isThinking ? 'animate-pulse' : ''
            }`}
          >
            {scenario.icon}
          </div>
          <div className="mt-4 text-center">
            <div className="font-display font-bold">{scenario.personaName}</div>
            <div className="text-xs text-ink-dim">{scenario.personaRole}</div>
          </div>
          {lastAiLine && (
            <div className="absolute inset-x-3 bottom-3 rounded-lg bg-black/50 px-3 py-2 text-center text-xs backdrop-blur">
              {lastAiLine}
            </div>
          )}
        </div>

        <div className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-white/5 p-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-surface-2 text-lg font-bold text-ink-dim">
            You
          </div>
          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-bad/80 text-xs" title="Mic off (typed reply)">
            🔇
          </div>
          {lastUserLine && (
            <div className="absolute inset-x-3 bottom-3 rounded-lg bg-black/50 px-3 py-2 text-center text-xs backdrop-blur">
              {lastUserLine}
            </div>
          )}
        </div>
      </div>

      <GlassCard className="mt-4">
        <TranscriptBubbles transcript={transcript} isThinking={isThinking} personaName={scenario.personaName} compact />
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
