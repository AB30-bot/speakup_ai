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
    <main className="mx-auto max-w-xl px-6 py-8">
      <div className="grain rounded-2xl bg-room px-6 pb-7 pt-9 text-center shadow-[0_24px_60px_-24px_rgba(34,28,18,0.5)]">
        <div className="relative mx-auto mb-5 h-28 w-28">
          {isThinking && (
            <>
              <span
                className="absolute inset-0 rounded-full border border-amber/60"
                style={{ animation: 'ring-pulse 1.8s ease-out infinite' }}
                aria-hidden
              />
              <span
                className="absolute inset-0 rounded-full border border-amber/40"
                style={{ animation: 'ring-pulse 1.8s ease-out 0.6s infinite' }}
                aria-hidden
              />
            </>
          )}
          <div
            className={`flex h-28 w-28 items-center justify-center rounded-full border bg-room-2 text-5xl transition-shadow ${
              isThinking ? 'border-amber shadow-[0_0_32px_rgba(217,138,36,0.3)]' : 'border-room-line'
            }`}
          >
            {scenario.icon}
          </div>
        </div>

        <div className="font-display text-2xl font-semibold tracking-tight text-room-ink">{scenario.personaName}</div>
        <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-room-dim">{scenario.personaRole}</div>

        <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#5fa870]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5fa870]" />
          {isThinking ? 'Speaking…' : 'Call in progress'}
        </div>

        <button
          className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#c03427] text-xl text-white transition-colors hover:bg-[#a02a1f]"
          onClick={onEndSession}
          aria-label="End call"
          title="End call"
        >
          <span className="inline-block rotate-[135deg]">📞</span>
        </button>
      </div>

      <GlassCard className="mt-4 p-5 text-left">
        <p className="kicker mb-3 text-ink-faint">Call transcript</p>
        <TranscriptBubbles transcript={transcript} isThinking={isThinking} personaName={scenario.personaName} />
        <div className="mt-4 border-t border-line pt-4">
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
