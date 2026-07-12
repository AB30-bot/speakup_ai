export interface CareerStage {
  level: number
  title: string
  description: string
}

export const CAREER_STAGES: CareerStage[] = [
  { level: 1, title: 'Talking to a Stranger', description: 'Simple introductions and small talk.' },
  { level: 2, title: 'Making Friends', description: 'Casual conversation, finding common ground.' },
  { level: 3, title: 'Speaking in Class', description: 'Explain a topic to classmates.' },
  { level: 4, title: 'Leading a School Project', description: 'Coordinate a group, assign tasks.' },
  { level: 5, title: 'Internship Interview', description: 'Answer behavioral questions.' },
  { level: 6, title: 'Job Interview', description: 'A formal interview under scrutiny.' },
  { level: 7, title: 'Business Meeting', description: 'Present a proposal to colleagues.' },
  { level: 8, title: 'Investor Pitch', description: 'Defend your idea under tough questioning.' },
  { level: 9, title: 'Podcast Interview', description: 'Stay engaging through free-flowing conversation.' },
  { level: 10, title: 'TED-Style Speech', description: 'Inspire a room at maximum difficulty.' },
]

export function careerStageFor(level: number): CareerStage {
  if (level >= 1 && level <= CAREER_STAGES.length) return CAREER_STAGES[level - 1]
  return {
    level,
    title: `Level ${level} — Uncharted Territory`,
    description: `A procedurally generated challenge beyond the TED stage, scaled to level ${level}.`,
  }
}

export function difficultyDescriptorFor(level: number): string {
  if (level <= 3) return 'low-pressure, encouraging audience'
  if (level <= 6) return 'moderate pressure, some pushback'
  if (level <= 10) return 'high pressure, direct challenges'
  const beyond = level - 10
  return `extreme pressure, hostile and unpredictable, escalating tier ${beyond} beyond TED-level`
}
