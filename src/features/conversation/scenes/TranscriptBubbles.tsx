import type { TranscriptTurn } from '../../../types'

export function TranscriptBubbles({
  transcript,
  isThinking,
  personaName,
  compact = false,
}: {
  transcript: TranscriptTurn[]
  isThinking: boolean
  personaName: string
  compact?: boolean
}) {
  return (
    <div className={`space-y-3 overflow-y-auto ${compact ? 'max-h-40' : 'max-h-96'}`}>
      {transcript.map((turn, i) => (
        <div
          key={i}
          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
            turn.role === 'ai'
              ? 'rounded-tl-md border border-border bg-white/5'
              : 'ml-auto rounded-tr-md bg-gradient-to-br from-purple/30 to-blue/30'
          }`}
        >
          {turn.text}
        </div>
      ))}
      {isThinking && <div className="text-xs text-ink-dim">{personaName} is thinking…</div>}
    </div>
  )
}
