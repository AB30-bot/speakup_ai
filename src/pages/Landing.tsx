import { Link } from 'react-router-dom'
import { CURATED_SCENARIOS } from '../data/scenarios'

const SCENE_LABELS: Record<string, string> = {
  videoCall: 'Video call',
  phoneCall: 'Phone call',
  stage: 'On stage',
  casual: 'Face to face',
}

export function Landing() {
  const preview = CURATED_SCENARIOS.slice(1, 5)

  return (
    <main className="mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pt-24">
      <div className="max-w-2xl">
        <p className="kicker mb-6 flex items-center gap-2 text-accent">
          <span className="h-px w-8 bg-accent" aria-hidden />
          The rehearsal room
        </p>
        <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Practice the conversations <em className="font-medium italic text-accent">that scare you.</em>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-dim">
          Sit across from AI personas — recruiters, investors, hostile customers, TED audiences —
          and get instant, honest feedback on how you actually sound.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/scenarios">Start speaking</Link>
          <Link className="btn-ghost" to="/dashboard">View dashboard</Link>
        </div>
      </div>

      <div className="mt-20 border-t border-line pt-8">
        <p className="kicker mb-5 text-ink-faint">In the room tonight</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
          {preview.map(s => (
            <div key={s.id} className="flex items-start gap-3">
              <span className="text-2xl leading-none">{s.icon}</span>
              <div>
                <div className="font-display text-[15px] font-semibold leading-tight">{s.title}</div>
                <div className="kicker mt-1 text-ink-faint">{SCENE_LABELS[s.sceneType]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
