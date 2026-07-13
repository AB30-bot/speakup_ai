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
      <header className="mb-10 flex items-baseline justify-between border-b border-line pb-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Your progress</h1>
        <span className="kicker hidden text-ink-faint sm:block">Session log · SpeakUp</span>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <GlassCard className="col-span-2 lg:col-span-1">
          <p className="kicker mb-3 text-ink-faint">Level</p>
          <div className="flex items-baseline justify-between">
            <b className="font-display text-4xl font-semibold">{levelInfo.level}</b>
            <span className="font-mono text-xs text-ink-dim">
              {levelInfo.xpIntoLevel}<span className="text-ink-faint">/{levelInfo.xpForNextLevel} XP</span>
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar percent={(levelInfo.xpIntoLevel / levelInfo.xpForNextLevel) * 100} />
          </div>
        </GlassCard>
        <GlassCard>
          <p className="kicker mb-3 text-ink-faint">Streak</p>
          <b className="font-display text-4xl font-semibold">
            {profile.streakCount}
            <span className="ml-1.5 align-middle text-xl">🔥</span>
          </b>
          <p className="mt-1 text-sm text-ink-dim">{profile.streakCount === 1 ? 'day in a row' : 'days in a row'}</p>
        </GlassCard>
        <GlassCard>
          <p className="kicker mb-3 text-ink-faint">Sessions</p>
          <b className="font-display text-4xl font-semibold">{sessions.length}</b>
          <p className="mt-1 text-sm text-ink-dim">completed</p>
        </GlassCard>
        <GlassCard>
          <p className="kicker mb-3 text-ink-faint">Avg score</p>
          <b className="font-display text-4xl font-semibold">{avgScore || '—'}</b>
          <p className="mt-1 text-sm text-ink-dim">out of 100</p>
        </GlassCard>
      </div>

      <div className="mb-8 rounded-xl border-l-[3px] border-accent bg-cream/70 py-5 pl-6 pr-6">
        <p className="kicker mb-2 text-accent">From your coach</p>
        <p className="font-display text-lg italic leading-relaxed text-ink">“{coachMessage(sessions)}”</p>
      </div>

      <GlassCard>
        <p className="kicker mb-5 text-ink-faint">Achievements</p>
        <div className="flex flex-wrap gap-x-6 gap-y-5">
          {ACHIEVEMENTS.map(a => {
            const unlocked = profile.unlockedAchievements.includes(a.id)
            return (
              <div key={a.id} className="w-[70px] text-center" title={a.title}>
                <div
                  className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                    unlocked
                      ? 'border-2 border-amber bg-paper shadow-[inset_0_0_0_3px_var(--color-cream)]'
                      : 'border border-dashed border-line-strong opacity-40 grayscale'
                  }`}
                >
                  {a.icon}
                </div>
                <span className={`text-[11px] font-medium leading-tight ${unlocked ? 'text-ink' : 'text-ink-faint'}`}>
                  {a.title}
                </span>
              </div>
            )
          })}
        </div>
      </GlassCard>
    </main>
  )
}
