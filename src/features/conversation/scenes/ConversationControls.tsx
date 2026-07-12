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
    <div className="flex items-center gap-3">
      {speechSupported && (
        <button
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl shadow-lg transition ${
            isListening ? 'animate-pulse bg-bad' : 'bg-gradient-to-br from-purple to-blue'
          }`}
          onClick={isListening ? onStopListening : onStartListening}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? '⏹' : '🎤'}
        </button>
      )}
      <input
        className="flex-1 rounded-xl border border-border bg-white/5 px-4 py-3 text-sm outline-none"
        placeholder={speechSupported ? 'Or type your reply…' : 'Type your reply…'}
        value={textInput}
        onChange={e => setTextInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
      />
      <button className="btn-primary shrink-0" onClick={submit}>Send</button>
    </div>
  )
}
