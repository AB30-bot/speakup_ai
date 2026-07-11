# SpeakUp AI — Design Spec (Phase 1: Web MVP)

**Status:** Draft for review
**Date:** 2026-07-11
**Goal:** A live, working AI public-speaking trainer deployed on Netlify, with a clean GitHub repo — built as a portfolio piece for a university application/CV. Real, polished, and honestly scoped, not a "millions of users" production build.

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + TypeScript | Fast to build, standard/idiomatic for a CS portfolio, zero-config Netlify deploy |
| Styling | Tailwind CSS | Matches the approved mockup's design tokens directly, fast iteration |
| Persistence | Browser `localStorage` | No login screen, no backend to stand up — data lives on-device, works immediately |
| AI | Gemini API (text + structured JSON output) | Persona conversation, evaluation scoring, scenario generation |
| Speech | Browser Web Speech API (`SpeechRecognition` + `speechSynthesis`) | Free, no extra service, built into Chrome/Edge |
| Hosting | Netlify (Git-based continuous deploy) | Auto-deploys on push, no CLI auth needed on this machine |
| Secrets | Netlify serverless function proxies Gemini calls | Gemini API key never reaches the browser |

**Explicitly out of scope for this phase:** native iOS/Android/desktop apps (App Store distribution is a possible future phase once the web version proves out), payments, multi-user social features, offline mode.

## 2. Architecture

Feature-folder structure (React equivalent of the clean-architecture separation from the original spec, scaled to app size):

```
src/
  app/            # routing, providers, top-level layout
  features/
    auth/         # sign-in, session state
    scenarios/    # curated personas + AI-generated scenario logic
    conversation/ # live voice session UI + Gemini chat + speech I/O
    evaluation/   # scoring engine, session report
    gamification/ # XP/levels/coins/streaks/achievements
    career/       # career mode ladder, infinite level generation
    dashboard/    # stats, charts, progress
  lib/
    firebase.ts   # Firebase init
    gemini.ts     # Gemini client (calls the Netlify function, never the raw API directly)
    speech.ts     # Web Speech API wrappers
  types/          # shared TypeScript types (Scenario, SessionReport, UserProfile, ...)
netlify/
  functions/
    gemini-proxy.ts   # holds GEMINI_API_KEY server-side, forwards structured requests
```

State: React Context + hooks for auth/session state; no heavier state library needed at this scope.

## 3. Data Model (`localStorage`, v1)

No login, no backend database in v1 — all state lives in the browser under a single namespaced key (`speakup:profile`):

- `profile` — `level`, `xp`, `coins`, `streakCount`, `lastSessionAt`, `careerLevel`, `unlockedAchievements[]`, `weakSkills[]` (rolling average used by the AI coach + infinite career generation)
- `sessions[]` — capped history (last ~30) of `{ scenario, transcript, categoryScores, overallScore, xpEarned, coinsEarned, timestamp }`
- `scenarios` (curated) — the ~8 fixed personas ship as a static JSON file in the repo, not a database table
- AI-generated scenarios (career mode level 11+, or "Generate New Scenario") are **not persisted anywhere shared** — generated per-request and stored only in that session's local record, since they're one-off by design

Data is per-browser/per-device only in v1 (clearing site data resets progress) — accepted trade-off for shipping fast. Moving this to Firebase Auth + Firestore for real accounts and cross-device sync is captured in Future Work.

## 4. Core Features

**Onboarding** — No login. First visit initializes a default local profile (level 1, 0 XP, careerLevel 1) straight into `localStorage` — the user can start a session immediately.

**Scenario selection** — Grid of curated personas (matches mockup) plus a "Generate New Scenario" action that calls Gemini for a fresh persona/mood/objective/twist as structured JSON.

**Live conversation** — Web Speech API captures mic input → transcribed text sent to Gemini with persona system-prompt + conversation history → Gemini's text reply is spoken back via `speechSynthesis`. Fallback: if the browser doesn't support `SpeechRecognition` (e.g. Firefox), fall back to a text-input chat mode rather than blocking the feature entirely.

**AI evaluation** — At session end, the full transcript is sent to Gemini with a structured-output request scoring: confidence, fluency, clarity, grammar, vocabulary, persuasiveness, pace, filler words, professionalism, structure, emotional impact, naturalness — each with a 0–100 score and a one-line "why." Overall score = weighted average.

**Session report** — Overall score, XP/coins earned, strengths/weaknesses, best sentence, transcript, and comparison to the user's rolling average (from `users/{uid}/sessions`).

**Gamification** — XP per session (scaled by score + difficulty), levels from an XP curve, coins as a secondary currency (cosmetic-only, no shop in v1 — coins accrue for future use), streak tracked by `lastSessionAt` date diff, achievements unlocked by simple rule checks (first session, 7-day streak, first 90+ score, etc.).

**Career Mode (infinite)** — `careerLevel` counter, never caps. Levels 1–10 use the fixed themed progression (stranger → job interview → investor pitch → TED talk...). Level 11+: Gemini generates the next level's scenario using the level number + the user's `weakSkills` to scale difficulty (rising stakes/hostility/interruption frequency), so the ladder is genuinely endless without hand-authored content.

**Dashboard** — Level/XP/streak/session-count stat cards, a score-over-time line chart, achievement badges row (matches mockup).

**AI Coach** — Lightweight in v1: after each session, one Gemini-generated paragraph highlighting the most important recurring weakness across recent sessions + one suggested next scenario. (Full long-term personalized training plans deferred — flagged as future work.)

## 5. Gemini Integration

All Gemini calls go through a single Netlify function (`gemini-proxy`) that holds `GEMINI_API_KEY` server-side. Three request "modes": `chat` (persona conversation turn), `evaluate` (structured JSON scoring), `generateScenario` (structured JSON scenario). Structured modes use Gemini's JSON-schema-constrained output so the frontend never has to parse free text.

## 6. Error Handling

- Mic permission denied → show a clear inline prompt to re-enable it, offer text-input fallback
- Gemini API failure mid-conversation → retry once, then show a "the AI lost connection, try again" state without losing the transcript so far
- `localStorage` write failure (e.g. quota exceeded, private browsing) → keep the report visible in-session and warn the user that progress won't persist on this device

## 7. Visual Design

Follows the approved mockup (`design-mockup/index.html`): dark mode by default, blue/purple gradient accents (`#8b5cf6` → `#3b82f6`), glassmorphism cards, `Sora` for headings / `Inter` for body text, rounded (20px) cards, animated score ring, pulsing mic button, subtle wave animation during listening.

## 8. Testing

Given the portfolio scope: unit tests for the pure-logic pieces (XP/level curve, streak calculation, scoring aggregation) with Vitest; manual QA for the conversation flow and speech I/O (hard to meaningfully unit test browser speech APIs). No E2E suite in v1 — noted as future work.

## 9. Deployment

1. `speakup_ai` becomes its own git repo, pushed to GitHub via the `github-publish` skill (already authenticated)
2. Netlify site connected to that GitHub repo via their dashboard (not CLI) — auto-deploys on push to `main`
3. `GEMINI_API_KEY` and Firebase config set as Netlify environment variables (never committed)

## 10. Future Work (explicitly deferred)

- Firebase Auth (Google sign-in) + Firestore — real accounts, cross-device sync, replacing `localStorage`
- Native iOS/Android app (App Store/Play Store) once the web version is validated
- Rewards shop / cosmetic unlockables spending coins
- Full long-term AI coach with personalized multi-week training plans
- Public profiles / leaderboard
- E2E test suite
