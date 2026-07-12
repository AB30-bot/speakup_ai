import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { evaluateSession } from '../lib/gemini'
import { xpForSession, coinsForSession, levelFromTotalXp } from '../lib/xp'
import { nextStreak } from '../lib/streak'
import { loadProfile, saveProfile, saveSession } from '../lib/storage'
import { newlyUnlockedAchievements } from '../features/gamification/achievements'
import { GlassCard } from '../components/ui/GlassCard'
import { ScoreRing } from '../components/ui/ScoreRing'
import { ProgressBar } from '../components/ui/ProgressBar'
import type { Scenario, EvaluationResult, TranscriptTurn } from '../types'

export function Report() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { scenario?: Scenario; transcript?: TranscriptTurn[] } | null
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [xpEarned, setXpEarned] = useState(0)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!state?.scenario || !state.transcript) return
    const scenario = state.scenario
    const transcript = state.transcript
    ;(async () => {
      try {
        const result = await evaluateSession(transcript)
        setEvaluation(result)

        const profile = loadProfile()
        const xp = xpForSession(result.overallScore, scenario.difficulty)
        const coins = coinsForSession(result.overallScore)
        const updatedProfile = {
          ...profile,
          xp: profile.xp + xp,
          level: levelFromTotalXp(profile.xp + xp).level,
          coins: profile.coins + coins,
          streakCount: nextStreak(profile.streakCount, profile.lastSessionAt, new Date()),
          lastSessionAt: new Date().toISOString(),
          careerLevel: profile.careerLevel + 1,
          weakSkills: result.weaknesses.slice(0, 3),
        }
        const session = {
          id: `session-${Date.now()}`,
          scenarioTitle: scenario.title,
          scenarioIcon: scenario.icon,
          transcript,
          evaluation: result,
          xpEarned: xp,
          coinsEarned: coins,
          timestamp: new Date().toISOString(),
        }
        const sessions = saveSession(session)
        const unlocked = newlyUnlockedAchievements(updatedProfile, sessions)
        saveProfile({ ...updatedProfile, unlockedAchievements: [...updatedProfile.unlockedAchievements, ...unlocked] })

        setXpEarned(xp)
        setCoinsEarned(coins)
        setNewAchievements(unlocked)
      } catch {
        setError('Could not score this session — your transcript is still safe, please try again.')
      }
    })()
  }, [state])

  if (!state?.scenario || !state.transcript) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-ink-dim">No session to report on.</p>
        <button className="btn-primary mt-4" onClick={() => navigate('/scenarios')}>Start a Session</button>
      </main>
    )
  }

  if (error) {
    return <main className="mx-auto max-w-2xl px-6 py-16 text-center text-bad">{error}</main>
  }

  if (!evaluation) {
    return <main className="mx-auto max-w-2xl px-6 py-16 text-center text-ink-dim">Scoring your session…</main>
  }

  const categoryEntries = Object.entries(evaluation.categoryScores) as [string, number][]

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <GlassCard className="text-center">
          <ScoreRing score={evaluation.overallScore} />
          <div className="mt-4 flex justify-center gap-3">
            <span className="rounded-full bg-blue/15 px-3 py-1.5 text-sm font-bold text-blue-light">✦ +{xpEarned} XP</span>
            <span className="rounded-full bg-warn/15 px-3 py-1.5 text-sm font-bold text-warn">🪙 +{coinsEarned}</span>
          </div>
          {newAchievements.length > 0 && (
            <p className="mt-4 text-xs font-bold text-purple-light">🏆 New achievement unlocked!</p>
          )}
        </GlassCard>

        <GlassCard>
          <div className="space-y-3">
            {categoryEntries.map(([key, score]) => (
              <div key={key} className="grid grid-cols-[120px_1fr_36px] items-center gap-3 text-sm">
                <span className="capitalize text-ink-dim">{key}</span>
                <ProgressBar percent={score} />
                <span className="text-right font-bold">{score}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-l-4 border-good bg-white/5 p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-dim">Strengths</h4>
              <ul className="space-y-1 text-sm">
                {evaluation.strengths.map((s, i) => <li key={i}>✓ {s}</li>)}
              </ul>
            </div>
            <div className="rounded-xl border-l-4 border-warn bg-white/5 p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-dim">Watch Out For</h4>
              <ul className="space-y-1 text-sm">
                {evaluation.weaknesses.map((w, i) => <li key={i}>⚠ {w}</li>)}
              </ul>
            </div>
          </div>

          <p className="mt-6 text-sm text-ink-dim">{evaluation.summary}</p>
          <button className="btn-primary mt-6" onClick={() => navigate('/dashboard')}>View Dashboard</button>
        </GlassCard>
      </div>
    </main>
  )
}
