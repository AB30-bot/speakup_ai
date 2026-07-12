export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}

export interface RecognitionHandlers {
  onResult: (text: string, isFinal: boolean) => void
  onEnd: () => void
  onError: (error: string) => void
}

export function createRecognizer(handlers: RecognitionHandlers): any {
  const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  const recognizer = new Ctor()
  recognizer.continuous = true
  recognizer.interimResults = true
  recognizer.lang = 'en-US'
  recognizer.onresult = (event: any) => {
    const result = event.results[event.results.length - 1]
    handlers.onResult(result[0].transcript, result.isFinal)
  }
  recognizer.onend = handlers.onEnd
  recognizer.onerror = (event: any) => handlers.onError(event.error)
  return recognizer
}

export function speak(text: string): void {
  if (!isSpeechSynthesisSupported()) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1.0
  window.speechSynthesis.speak(utterance)
}
