# SpeakUp AI

AI-powered public speaking trainer — practice real conversations with AI personas (recruiters, investors, hostile customers, TED audiences) and get instant, honest feedback on how you actually sound.

Built as a portfolio project: React + Vite + TypeScript, Tailwind CSS v4, the Web Speech API for voice input/output, and the Gemini API (proxied through a Netlify function so the key never reaches the browser) for persona conversation, scoring, and infinite scenario/Career Mode generation. No login — progress lives in the browser via `localStorage`.

## Features

- 8 curated AI personas, plus "Generate New Scenario" for unlimited AI-generated ones
- Live voice conversation (falls back to text input if the browser doesn't support the Web Speech API)
- AI evaluation across 12 categories (confidence, fluency, clarity, filler words, and more) with an overall score and a written "why"
- XP, levels, coins, streaks, and achievements
- Infinite Career Mode — a themed 1–10 ladder, then endless AI-generated levels scaled to the user's recent weak skills
- A lightweight AI coach that surfaces your weakest skill on the dashboard

## Local development

```bash
npm install
npm run dev       # UI only — Gemini calls will fail (no functions server)
# or
netlify dev       # UI + local Netlify function, reads GEMINI_API_KEY from .env
```

## Testing

```bash
npm run test
```

## Deployment

1. Push this repo to GitHub.
2. In the Netlify dashboard, "Import an existing project" from that GitHub repo — Netlify auto-detects `netlify.toml`.
3. Set the `GEMINI_API_KEY` environment variable in the Netlify site's build settings (never commit it).
4. Every push to `main` auto-deploys.

## Future work

- Firebase Auth (Google sign-in) + Firestore, replacing `localStorage` with real accounts and cross-device sync
- Native iOS/Android app once the web version is validated
- Rewards shop / cosmetic unlockables spending coins
- Full long-term AI coach with personalized multi-week training plans
- Public profiles / leaderboard
- End-to-end test suite
