import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CURATED_SCENARIOS } from '../data/scenarios'
import { GlassCard } from '../components/ui/GlassCard'
import { DifficultyBadge } from '../components/ui/Badge'
import { careerStageFor, difficultyDescriptorFor } from '../features/career/career'
import { loadProfile } from '../lib/storage'
import { generateScenario } from '../lib/gemini'
import type { Scenario } from '../types'

export function Scenarios() {
  const navigate = useNavigate()
  const profile = loadProfile()
  const stage = careerStageFor(profile.careerLevel)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function startScenario(scenario: Scenario) {
    navigate('/conversation', { state: { scenario } })
  }

  function startCareerStage() {
    if (profile.careerLevel <= 10) {
      const matched = CURATED_SCENARIOS[Math.min(profile.careerLevel - 1, CURATED_SCENARIOS.length - 1)]
      startScenario(matched)
      return
    }
    handleGenerate(profile.careerLevel)
  }

  async function handleGenerate(difficultyLevel = 5) {
    setIsGenerating(true)
    setError(null)
    try {
      const generated = await generateScenario(difficultyLevel, profile.weakSkills)
      const scenario: Scenario = {
        id: `generated-${Date.now()}`,
        title: generated.title ?? 'Generated Scenario',
        personaName: generated.personaName ?? 'AI Persona',
        personaRole: generated.personaRole ?? 'Practice Partner',
        icon: '✨',
        description: generated.objective ?? '',
        difficulty: difficultyLevel,
        mood: generated.mood ?? 'neutral',
        objective: generated.objective ?? "Let's begin.",
        systemPrompt: generated.systemPrompt ?? `Roleplay as ${generated.personaName ?? 'a practice partner'}. Never break character.`,
      }
      startScenario(scenario)
    } catch {
      setError('Could not generate a new scenario — try again in a moment.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <GlassCard className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-purple-light">Career Mode · Level {profile.careerLevel}</span>
          <h2 className="font-display text-xl font-bold">{stage.title}</h2>
          <p className="text-sm text-ink-dim">{stage.description} — {difficultyDescriptorFor(profile.careerLevel)}.</p>
        </div>
        <button className="btn-primary" onClick={startCareerStage} disabled={isGenerating}>
          Continue Career Mode
        </button>
      </GlassCard>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Choose Your Challenge</h1>
        <button className="btn-ghost" onClick={() => handleGenerate(5)} disabled={isGenerating}>
          {isGenerating ? 'Generating…' : '✨ Generate New Scenario'}
        </button>
      </div>
      {error && <p className="mb-4 text-sm text-bad">{error}</p>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CURATED_SCENARIOS.map(scenario => (
          <GlassCard key={scenario.id} className="cursor-pointer transition hover:-translate-y-1">
            <button className="w-full text-left" onClick={() => startScenario(scenario)}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-2xl">{scenario.icon}</div>
              <h3 className="font-display font-bold">{scenario.title}</h3>
              <p className="mb-4 text-sm text-ink-dim">{scenario.description}</p>
              <DifficultyBadge difficulty={scenario.difficulty} />
            </button>
          </GlassCard>
        ))}
      </div>
    </main>
  )
}
