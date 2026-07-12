import type { UserProfile, SessionRecord } from '../types'

const PROFILE_KEY = 'speakup:profile'
const SESSIONS_KEY = 'speakup:sessions'
const MAX_SESSIONS = 30

export function defaultProfile(): UserProfile {
  return {
    xp: 0,
    level: 1,
    coins: 0,
    streakCount: 0,
    lastSessionAt: null,
    careerLevel: 1,
    unlockedAchievements: [],
    weakSkills: [],
  }
}

export function loadProfile(): UserProfile {
  const raw = localStorage.getItem(PROFILE_KEY)
  if (!raw) return defaultProfile()
  try {
    return { ...defaultProfile(), ...JSON.parse(raw) }
  } catch {
    return defaultProfile()
  }
}

export function saveProfile(profile: UserProfile): boolean {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    return true
  } catch {
    return false
  }
}

export function loadSessions(): SessionRecord[] {
  const raw = localStorage.getItem(SESSIONS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveSession(session: SessionRecord): SessionRecord[] {
  const sessions = [session, ...loadSessions()].slice(0, MAX_SESSIONS)
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  } catch {
    // storage full or unavailable — caller still gets the in-memory list back
  }
  return sessions
}
