import { GlassCard } from '../../../components/ui/GlassCard'
import { TranscriptBubbles } from './TranscriptBubbles'
import { ConversationControls } from './ConversationControls'
import type { SceneProps } from './SceneProps'

export function StageFrame({
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
  const isPodiumSplit = scenario.stageVariant === 'podiumSplit'

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-purple-light">
          {isPodiumSplit ? 'Debate Floor' : 'Main Stage'}
        </span>
        <button className="btn-ghost text-xs" onClick={onEndSession}>Leave Stage</button>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-border p-8"
        style={{ background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.22), transparent 60%), var(--color-surface)' }}
      >
        {isPodiumSplit ? (
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div
                className={`mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple to-blue text-3xl ${
                  isThinking ? 'animate-pulse' : ''
                }`}
              >
                {scenario.icon}
              </div>
              <div className="font-display text-sm font-bold">{scenario.personaName}</div>
              <div className="text-xs text-ink-dim">{scenario.personaRole}</div>
              <div className="mx-auto mt-3 h-24 w-2 rounded-full bg-white/10" />
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface-2 text-lg font-bold text-ink-dim">
                You
              </div>
              <div className="font-display text-sm font-bold">You</div>
              <div className="text-xs text-ink-dim">Challenger</div>
              <div className="mx-auto mt-3 h-24 w-2 rounded-full bg-white/10" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface-2 text-lg font-bold text-ink-dim">
              You
            </div>
            <div className="mx-auto h-16 w-2 rounded-full bg-white/10" />
            <div className="mt-6 flex flex-wrap justify-center gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-5 w-5 rounded-full border border-border bg-white/10" />
              ))}
            </div>
            <div className="mt-2 text-xs text-ink-dim">{scenario.personaRole}</div>
          </div>
        )}
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
