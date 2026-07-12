import { describe, it, expect } from 'vitest'
import { isSpeechRecognitionSupported, isSpeechSynthesisSupported } from './speech'

describe('speech feature detection', () => {
  it('reports unsupported when SpeechRecognition is not on window (jsdom has none)', () => {
    expect(isSpeechRecognitionSupported()).toBe(false)
  })
  it('reports unsupported when speechSynthesis is not on window (jsdom has none)', () => {
    expect(isSpeechSynthesisSupported()).toBe(false)
  })
})
