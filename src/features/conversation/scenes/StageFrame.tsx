import { GlassCard } from '../../../components/ui/GlassCard'
import { TranscriptBubbles } from './TranscriptBubbles'
import { ConversationControls } from './ConversationControls'
import type { SceneProps } from './SceneProps'

function Spotlight({ active }: { active: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 -top-8 bottom-0 transition-opacity duration-700"
      style={{
        opacity: active ? 1 : 0.15,
        background:
          'radial-gradient(ellipse 55% 85% at 50% 0%, rgba(239,172,78,0.32), rgba(217,138,36,0.1) 55%, transparent 75%)',
      }}
      aria-hidden
    />
  )
}

function Podium() {
  return (
    <div className="mx-auto mt-4 w-28" aria-hidden>
      <div className="h-2 rounded-sm bg-[#4a3823]" />
      <div
        className="h-20 bg-gradient-to-b from-[#3b2c1b] to-[#2a1f13]"
        style={{ clipPath: 'polygon(8% 0, 92% 0, 100% 100%, 0 100%)' }}
      />
    </div>
  )
}

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
  // The AI holds the floor while composing; otherwise the light is on you.
  const aiHasFloor = isThinking

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="grain relative overflow-hidden rounded-2xl bg-[#120e0a] pb-10 pt-5 shadow-[0_24px_60px_-24px_rgba(34,28,18,0.55)]">
        {/* House header */}
        <div className="mb-6 flex items-center justify-between px-6">
          <span className="kicker text-amber-bright">
            {isPodiumSplit ? 'Debate floor' : 'Main stage'}
          </span>
          <button className="btn-room text-xs" onClick={onEndSession}>Leave stage</button>
        </div>

        {isPodiumSplit ? (
          <div className="grid grid-cols-2 gap-4 px-6 sm:gap-10 sm:px-12">
            {/* Opponent */}
            <div className="relative pt-6 text-center">
              <Spotlight active={aiHasFloor} />
              <div className="relative">
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border text-3xl transition-all duration-500 ${
                    aiHasFloor
                      ? 'border-amber bg-[#3a2d1c] shadow-[0_0_36px_rgba(217,138,36,0.4)]'
                      : 'border-room-line bg-room-2'
                  }`}
                >
                  {scenario.icon}
                </div>
                <div className={`mt-3 font-display text-base font-semibold transition-colors duration-500 ${aiHasFloor ? 'text-amber-bright' : 'text-room-ink'}`}>
                  {scenario.personaName}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-room-dim">{scenario.personaRole}</div>
                {aiHasFloor && (
                  <div className="mt-2 flex items-end justify-center gap-[2px] text-amber-bright" aria-label="Speaking">
                    <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
                  </div>
                )}
                <Podium />
              </div>
            </div>

            {/* You */}
            <div className="relative pt-6 text-center">
              <Spotlight active={!aiHasFloor} />
              <div className="relative">
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border font-display text-lg font-semibold transition-all duration-500 ${
                    !aiHasFloor
                      ? 'border-amber bg-[#3a2d1c] text-amber-bright shadow-[0_0_36px_rgba(217,138,36,0.4)]'
                      : 'border-room-line bg-room-2 text-room-dim'
                  }`}
                >
                  You
                </div>
                <div className={`mt-3 font-display text-base font-semibold transition-colors duration-500 ${!aiHasFloor ? 'text-amber-bright' : 'text-room-ink'}`}>
                  You
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-room-dim">Challenger</div>
                {!aiHasFloor && (
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-bright">
                    The floor is yours
                  </div>
                )}
                <Podium />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative px-6 pt-4 text-center">
            <Spotlight active />
            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber bg-[#3a2d1c] font-display text-lg font-semibold text-amber-bright shadow-[0_0_36px_rgba(217,138,36,0.4)]">
                You
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-bright">On stage</div>
              <Podium />

              {/* The house */}
              <div className="mt-8 border-t border-room-line pt-5">
                <div className="flex flex-wrap justify-center gap-2 opacity-70">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-4 w-4 rounded-t-full bg-[#241c12]"
                      style={{ transform: `translateY(${(i % 3) * 2}px)` }}
                    />
                  ))}
                </div>
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-room-dim">
                  {scenario.personaRole}
                  {isThinking && <span className="ml-2 text-amber-bright">· reacting…</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage floor glow */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: 'linear-gradient(to top, rgba(217,138,36,0.07), transparent)' }}
          aria-hidden
        />
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
