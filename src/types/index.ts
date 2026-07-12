export interface CategoryScores {
  confidence: number
  fluency: number
  clarity: number
  grammar: number
  vocabulary: number
  persuasiveness: number
  pace: number
  fillerWords: number
  professionalism: number
  structure: number
  emotionalImpact: number
  naturalness: number
}

export interface EvaluationResult {
  categoryScores: CategoryScores
  categoryReasons: Partial<Record<keyof CategoryScores, string>>
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  bestSentence: string
  summary: string
}

export type SceneType = 'videoCall' | 'stage' | 'phoneCall' | 'casual'

export interface Scenario {
  id: string
  title: string
  personaName: string
  personaRole: string
  icon: string
  description: string
  difficulty: number
  mood: string
  objective: string
  systemPrompt: string
  sceneType: SceneType
  stageVariant?: 'audience' | 'podiumSplit'
}

export interface TranscriptTurn {
  role: 'ai' | 'user'
  text: string
}

export interface SessionRecord {
  id: string
  scenarioTitle: string
  scenarioIcon: string
  transcript: TranscriptTurn[]
  evaluation: EvaluationResult
  xpEarned: number
  coinsEarned: number
  timestamp: string
}

export interface UserProfile {
  xp: number
  level: number
  coins: number
  streakCount: number
  lastSessionAt: string | null
  careerLevel: number
  unlockedAchievements: string[]
  weakSkills: string[]
}
