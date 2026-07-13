import type { ReactNode } from 'react'

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const padding = /\bp-\d/.test(className) ? '' : 'p-6'
  return <div className={`glass ${padding} ${className}`}>{children}</div>
}
