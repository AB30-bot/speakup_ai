import { loadProfile, loadSessions } from '../lib/storage'
import { levelFromTotalXp } from '../lib/xp'
import { coachMessage } from '../features/coach/coach'
import { ACHIEVEMENTS } from '../features/gamification/achievements'
import { GlassCard } from '../components/ui/GlassCard'
import { ProgressBar } from '../components/ui/ProgressBar'

export function Dashboard() {
  const profile = loadProfile()
  const sessions = loadSessions()
  const levelInfo = levelFromTotalXp(profile.xp)
  const avgScore = sessions.length
    ? Math.round(sessions.reduce((sum, s) => sum + s.evaluation.overallScore, 0) / sessions.length)
    : 0

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 font-display text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        <GlassCard>
          <b className="font-display text-3xl">Level {levelInfo.level}</b>
          <p className="text-sm text-ink-dim">{levelInfo.xpIntoLevel} / {levelInfo.xpForNextLevel} XP</p>
          <div className="mt-3"><ProgressBar percent={(levelInfo.xpIntoLevel / levelInfo.xpForNextLevel) * 100} /></div>
        </GlassCard>
        <GlassCard>
          <b className="font-display text-3xl">🔥 {profile.streakCount}</b>
          <p className="text-sm text-ink-dim">Day streak</p>
        </GlassCard>
        <GlassCard>
          <b className="font-display text-3xl">{sessions.length}</b>
          <p className="text-sm text-ink-dim">Sessions completed</p>
        </GlassCard>
        <GlassCard>
          <b className="font-display text-3xl">{avgScore || '—'}</b>
          <p className="text-sm text-ink-dim">Average score</p>
        </GlassCard>
      </div>

      <GlassCard className="mb-8">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-dim">Your AI Coach</h4>
        <p className="text-sm">{coachMessage(sessions)}</p>
      </GlassCard>

      <GlassCard>
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-dim">Achievements</h4>
        <div className="flex flex-wrap gap-4">
          {ACHIEVEMENTS.map(a => {
            const unlocked = profile.unlockedAchievements.includes(a.id)
            return (
              <div key={a.id} className={`w-16 text-center text-xs ${unlocked ? '' : 'opacity-30 grayscale'}`}>
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-purple/25 to-blue/25 text-2xl">{a.icon}</div>
                {a.title}
              </div>
            )
          })}
        </div>
      </GlassCard>
    </main>
  )
}
