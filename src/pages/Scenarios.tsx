import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CURATED_SCENARIOS } from '../data/scenarios'
import { DifficultyBadge } from '../components/ui/Badge'
import { careerStageFor, difficultyDescriptorFor } from '../features/career/career'
import { loadProfile } from '../lib/storage'
import { generateScenario } from '../lib/gemini'
import type { Scenario, SceneType } from '../types'

const SCENE_META: Record<SceneType, { label: string; plate: string }> = {
  videoCall: { label: 'Video call', plate: 'bg-[#e4e9e2]' },
  phoneCall: { label: 'Phone call', plate: 'bg-[#ece1d2]' },
  stage: { label: 'On stage', plate: 'bg-[#f0e3c8]' },
  casual: { label: 'Face to face', plate: 'bg-[#e9e4d6]' },
}

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
      const validSceneTypes: Scenario['sceneType'][] = ['videoCall', 'stage', 'phoneCall', 'casual']
      const sceneType = validSceneTypes.includes(generated.sceneType as Scenario['sceneType'])
        ? (generated.sceneType as Scenario['sceneType'])
        : 'casual'
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
        sceneType,
        stageVariant: generated.stageVariant === 'podiumSplit' ? 'podiumSplit' : 'audience',
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
      {/* Career mode — a ticket into the next room */}
      <div className="grain mb-12 flex flex-col justify-between gap-5 rounded-xl bg-room px-7 py-6 text-room-ink sm:flex-row sm:items-center">
        <div>
          <p className="kicker mb-2 text-amber-bright">Career mode · Level {profile.careerLevel}</p>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{stage.title}</h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-room-dim">
            {stage.description} — {difficultyDescriptorFor(profile.careerLevel)}.
          </p>
        </div>
        <button className="btn-primary shrink-0" onClick={startCareerStage} disabled={isGenerating}>
          Continue career →
        </button>
      </div>

      <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Pick your room</h1>
        <button className="btn-ghost text-sm" onClick={() => handleGenerate(5)} disabled={isGenerating}>
          {isGenerating ? 'Writing one for you…' : 'Generate a new scenario'}
        </button>
      </div>
      {error && <p className="mb-4 text-sm font-medium text-bad">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CURATED_SCENARIOS.map(scenario => {
          const meta = SCENE_META[scenario.sceneType]
          return (
            <button
              key={scenario.id}
              onClick={() => startScenario(scenario)}
              className="group glass flex flex-col p-5 text-left transition-all duration-150 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_2px_4px_rgba(34,28,18,0.08),0_18px_36px_-18px_rgba(34,28,18,0.35)]"
            >
              <div className="mb-4 flex items-start justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-[14px] border border-ink/10 text-2xl ${meta.plate}`}
                >
                  {scenario.icon}
                </span>
                <span className="kicker mt-1 text-ink-faint">{meta.label}</span>
              </div>
              <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{scenario.title}</h3>
              <p className="mb-5 mt-1.5 text-sm leading-relaxed text-ink-dim">{scenario.description}</p>
              <div className="mt-auto flex items-center justify-between border-t border-line pt-3.5">
                <DifficultyBadge difficulty={scenario.difficulty} />
                <span className="text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent">→</span>
              </div>
            </button>
          )
        })}
      </div>
    </main>
  )
}
