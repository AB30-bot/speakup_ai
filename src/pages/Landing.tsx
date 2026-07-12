import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-center">
      <span className="mb-5 inline-block rounded-full border border-purple/30 bg-purple/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-purple-light">
        AI Public Speaking Trainer
      </span>
      <h1 className="mx-auto max-w-3xl font-display text-5xl font-extrabold leading-tight">
        Master Communication <span className="gradient-text">Through AI</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-ink-dim">
        Practice real conversations with AI personas — recruiters, investors, hostile customers, TED audiences — and get instant, honest feedback on how you actually sound.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link className="btn-primary" to="/scenarios">▶ Start Speaking</Link>
        <Link className="btn-ghost" to="/dashboard">View Dashboard</Link>
      </div>
    </main>
  )
}
