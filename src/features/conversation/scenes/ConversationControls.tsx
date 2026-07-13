import { useState } from 'react'

interface Props {
  speechSupported: boolean
  isListening: boolean
  onStartListening: () => void
  onStopListening: () => void
  onSend: (text: string) => void
}

export function ConversationControls({
  speechSupported,
  isListening,
  onStartListening,
  onStopListening,
  onSend,
}: Props) {
  const [textInput, setTextInput] = useState('')

  function submit() {
    if (!textInput.trim()) return
    onSend(textInput)
    setTextInput('')
  }

  return (
    <div className="flex items-center gap-2.5">
      {speechSupported && (
        <button
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg transition-colors ${
            isListening
              ? 'bg-bad text-cream'
              : 'border border-line-strong bg-cream text-ink hover:bg-paper'
          }`}
          onClick={isListening ? onStopListening : onStartListening}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening && (
            <span
              className="absolute inset-0 rounded-full bg-bad"
              style={{ animation: 'ring-pulse 1.4s ease-out infinite' }}
              aria-hidden
            />
          )}
          <span className="relative">{isListening ? '■' : '🎤'}</span>
        </button>
      )}
      <div className="flex flex-1 items-center gap-1.5 rounded-full border border-line-strong bg-cream py-1.5 pl-5 pr-1.5 shadow-[inset_0_1px_2px_rgba(34,28,18,0.05)] focus-within:border-ink-faint">
        <input
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
          placeholder={speechSupported ? 'Or type your reply…' : 'Type your reply…'}
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-base font-bold text-cream transition-colors hover:bg-accent-deep disabled:opacity-40"
          onClick={submit}
          disabled={!textInput.trim()}
          aria-label="Send"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
