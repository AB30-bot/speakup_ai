import { Link, useLocation } from 'react-router-dom'

export function NavBar() {
  const { pathname } = useLocation()

  const linkClass = (to: string) =>
    `kicker rounded-md px-3 py-2 transition-colors ${
      pathname === to ? 'bg-ink text-cream' : 'text-ink-dim hover:text-ink'
    }`

  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="group flex items-baseline gap-0.5 font-display text-[22px] font-bold tracking-tight">
          Speak<span className="italic text-accent">Up</span>
          <span className="ml-1 inline-block h-2 w-2 translate-y-[-1px] rounded-full bg-accent transition-transform group-hover:scale-125" />
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/scenarios" className={linkClass('/scenarios')}>Scenarios</Link>
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
        </div>
      </div>
    </nav>
  )
}
