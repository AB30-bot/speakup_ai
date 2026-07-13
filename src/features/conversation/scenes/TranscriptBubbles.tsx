import { useEffect, useRef } from 'react'
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
  const endRef = useRef<HTMLDivElement>(null)
  const initial = personaName.trim().charAt(0).toUpperCase() || '?'

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [transcript.length, isThinking])

  return (
    <div className={`transcript-scroll space-y-1 overflow-y-auto pr-1 ${compact ? 'max-h-44' : 'max-h-96'}`}>
      {transcript.map((turn, i) => {
        const prevRole = transcript[i - 1]?.role
        const isFirstOfGroup = prevRole !== turn.role

        if (turn.role === 'ai') {
          return (
            <div key={i} className={`flex items-end gap-2.5 ${isFirstOfGroup ? 'mt-4 first:mt-0' : ''}`}>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[11px] font-medium text-cream ${
                  isFirstOfGroup ? '' : 'invisible'
                }`}
                aria-hidden
              >
                {initial}
              </span>
              <div className="max-w-[78%]">
                {isFirstOfGroup && (
                  <div className="mb-1 ml-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                    {personaName}
                  </div>
                )}
                <div className="rounded-2xl rounded-bl-md border border-line bg-cream px-4 py-2.5 text-[15px] leading-relaxed shadow-[0_1px_2px_rgba(34,28,18,0.05)]">
                  {turn.text}
                </div>
              </div>
            </div>
          )
        }

        return (
          <div key={i} className={`flex justify-end ${isFirstOfGroup ? 'mt-4 first:mt-0' : ''}`}>
            <div className="max-w-[78%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[15px] leading-relaxed text-cream shadow-[0_1px_2px_rgba(34,28,18,0.15)]">
              {turn.text}
            </div>
          </div>
        )
      })}

      {isThinking && (
        <div className="mt-4 flex items-end gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[11px] font-medium text-cream" aria-hidden>
            {initial}
          </span>
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-cream px-4 py-3.5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  )
}
