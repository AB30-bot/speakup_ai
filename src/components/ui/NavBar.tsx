import { Link } from 'react-router-dom'

export function NavBar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-border bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-blue">🎙️</span>
          SpeakUp AI
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-ink-dim">
          <Link to="/scenarios" className="hover:text-ink">Scenarios</Link>
          <Link to="/dashboard" className="hover:text-ink">Dashboard</Link>
        </div>
      </div>
    </nav>
  )
}
