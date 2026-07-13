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
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="grain rounded-2xl bg-room p-4 shadow-[0_24px_60px_-24px_rgba(34,28,18,0.5)] sm:p-5">
        {/* Call header */}
        <div className="mb-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#e05a4e]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e05a4e]" /> Rec
            </span>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-room-dim sm:block">
              {scenario.title}
            </span>
          </div>
          <button
            className="rounded-full bg-[#c03427] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#a02a1f]"
            onClick={onEndSession}
          >
            End call
          </button>
        </div>

        {/* Video tiles */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Persona tile */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-room-line bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,#332a20,var(--color-room-2)_70%)]">
            <div className="absolute inset-0 flex items-center justify-center pb-8">
              <div className="relative">
                {isThinking && (
                  <span
                    className="absolute inset-0 rounded-full border-2 border-amber"
                    style={{ animation: 'ring-pulse 1.6s ease-out infinite' }}
                    aria-hidden
                  />
                )}
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-full border bg-room-3 text-4xl transition-shadow ${
                    isThinking ? 'border-amber shadow-[0_0_28px_rgba(217,138,36,0.35)]' : 'border-room-line'
                  }`}
                >
                  {scenario.icon}
                </div>
              </div>
            </div>
            {lastAiLine && (
              <div className="absolute inset-x-3 bottom-12 rounded-md bg-black/55 px-3 py-1.5 text-center text-xs leading-relaxed text-room-ink backdrop-blur-sm">
                {lastAiLine}
              </div>
            )}
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 rounded-md bg-black/55 px-2.5 py-1.5 backdrop-blur-sm">
              {isThinking ? (
                <span className="flex items-end gap-[2px] text-amber-bright" aria-label="Speaking">
                  <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full bg-[#5fa870]" aria-label="Connected" />
              )}
              <span className="text-[13px] font-semibold leading-none text-white">{scenario.personaName}</span>
              <span className="text-[11px] leading-none text-room-dim">{scenario.personaRole}</span>
            </div>
          </div>

          {/* Your tile — camera off */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-room-line bg-room-2">
            <div className="absolute inset-0 flex items-center justify-center pb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-room-line bg-room-3 font-display text-xl font-semibold text-room-dim">
                You
              </div>
            </div>
            <div className="absolute right-2.5 top-2.5 rounded-md bg-black/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-room-dim backdrop-blur-sm">
              Camera off
            </div>
            {lastUserLine && (
              <div className="absolute inset-x-3 bottom-12 rounded-md bg-black/55 px-3 py-1.5 text-center text-xs leading-relaxed text-room-ink backdrop-blur-sm">
                {lastUserLine}
              </div>
            )}
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 rounded-md bg-black/55 px-2.5 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#5fa870]" aria-hidden />
              <span className="text-[13px] font-semibold leading-none text-white">You</span>
            </div>
          </div>
        </div>
      </div>

      <GlassCard className="mt-4 p-5">
        <p className="kicker mb-3 text-ink-faint">Transcript</p>
        <TranscriptBubbles transcript={transcript} isThinking={isThinking} personaName={scenario.personaName} compact />
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
