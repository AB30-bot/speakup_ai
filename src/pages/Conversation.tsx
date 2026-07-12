import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useConversation } from '../features/conversation/useConversation'
import { GlassCard } from '../components/ui/GlassCard'
import { isSpeechRecognitionSupported } from '../lib/speech'
import type { Scenario } from '../types'

export function Conversation() {
  const location = useLocation()
  const navigate = useNavigate()
  const scenario = (location.state as { scenario?: Scenario } | null)?.scenario
  const [textInput, setTextInput] = useState('')

  if (!scenario) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-ink-dim">No scenario selected.</p>
        <button className="btn-primary mt-4" onClick={() => navigate('/scenarios')}>Choose a Scenario</button>
      </main>
    )
  }

  return <ConversationSession scenario={scenario} textInput={textInput} setTextInput={setTextInput} />
}

function ConversationSession({
  scenario,
  textInput,
  setTextInput,
}: {
  scenario: Scenario
  textInput: string
  setTextInput: (v: string) => void
}) {
  const navigate = useNavigate()
  const { transcript, isListening, isThinking, sendMessage, startListening, stopListening } = useConversation(scenario)
  const speechSupported = isSpeechRecognitionSupported()

  function endSession() {
    navigate('/report', { state: { scenario, transcript } })
  }

  function submitText() {
    if (!textInput.trim()) return
    sendMessage(textInput)
    setTextInput('')
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <GlassCard>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-blue text-xl">{scenario.icon}</div>
            <div>
              <div className="font-display font-bold">{scenario.personaName}</div>
              <div className="text-xs text-ink-dim">{scenario.personaRole}</div>
            </div>
          </div>
          <button className="btn-ghost" onClick={endSession}>End Session</button>
        </div>

        <div className="mb-6 max-h-96 space-y-3 overflow-y-auto">
          {transcript.map((turn, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                turn.role === 'ai'
                  ? 'rounded-tl-md bg-white/5 border border-border'
                  : 'ml-auto rounded-tr-md bg-gradient-to-br from-purple/30 to-blue/30'
              }`}
            >
              {turn.text}
            </div>
          ))}
          {isThinking && <div className="text-xs text-ink-dim">{scenario.personaName} is thinking…</div>}
        </div>

        {speechSupported && (
          <div className="flex items-center justify-center gap-4">
            <button
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple to-blue text-2xl shadow-lg"
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? '⏹' : '🎤'}
            </button>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <input
            className="flex-1 rounded-xl border border-border bg-white/5 px-4 py-3 text-sm outline-none"
            placeholder={speechSupported ? 'Or type your reply…' : 'Type your reply…'}
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitText()}
          />
          <button className="btn-primary" onClick={submitText}>Send</button>
        </div>
      </GlassCard>
    </main>
  )
}
