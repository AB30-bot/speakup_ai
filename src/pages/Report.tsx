import { useEffect, useRef, useState } from 'react'
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
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (!state?.scenario || !state.transcript) return
    if (hasStartedRef.current) return
    hasStartedRef.current = true
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
    return <main className="mx-auto max-w-2xl px-6 py-16 text-center font-medium text-bad">{error}</main>
  }

  if (!evaluation) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-display text-2xl italic text-ink-dim">Scoring your session…</p>
        <p className="kicker mt-3 text-ink-faint">The judges are conferring</p>
      </main>
    )
  }

  const categoryEntries = Object.entries(evaluation.categoryScores) as [string, number][]

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8 border-b border-line pb-5">
        <p className="kicker mb-1 text-accent">Session report</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {state.scenario.icon} {state.scenario.title}
        </h1>
      </header>

      <div className="grid gap-5 md:grid-cols-[300px_1fr]">
        <GlassCard className="self-start p-6 text-center">
          <ScoreRing score={evaluation.overallScore} />
          <div className="mt-5 flex justify-center gap-2.5">
            <span className="kicker rounded-md border border-amber/40 bg-amber/10 px-2.5 py-1.5 text-warn">
              +{xpEarned} XP
            </span>
            <span className="kicker rounded-md border border-line-strong bg-paper px-2.5 py-1.5 text-ink-dim">
              +{coinsEarned} coins
            </span>
          </div>
          {newAchievements.length > 0 && (
            <p className="kicker mt-4 text-accent">🏆 New achievement unlocked</p>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <p className="kicker mb-4 text-ink-faint">Category scores</p>
          <div className="space-y-2.5">
            {categoryEntries.map(([key, score]) => (
              <div key={key} className="grid grid-cols-[130px_1fr_36px] items-center gap-3 text-sm">
                <span className="capitalize text-ink-dim">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                <ProgressBar percent={score} />
                <span className="text-right font-mono text-xs font-medium">{score}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border-l-[3px] border-good bg-paper/70 p-4">
              <p className="kicker mb-2.5 text-good">Strengths</p>
              <ul className="space-y-1.5 text-sm leading-relaxed">
                {evaluation.strengths.map((s, i) => <li key={i}>✓ {s}</li>)}
              </ul>
            </div>
            <div className="rounded-lg border-l-[3px] border-warn bg-paper/70 p-4">
              <p className="kicker mb-2.5 text-warn">Watch out for</p>
              <ul className="space-y-1.5 text-sm leading-relaxed">
                {evaluation.weaknesses.map((w, i) => <li key={i}>· {w}</li>)}
              </ul>
            </div>
          </div>

          <p className="mt-7 border-t border-line pt-5 font-display text-[17px] italic leading-relaxed text-ink-dim">
            “{evaluation.summary}”
          </p>
          <button className="btn-primary mt-6" onClick={() => navigate('/dashboard')}>View dashboard</button>
        </GlassCard>
      </div>
    </main>
  )
}
