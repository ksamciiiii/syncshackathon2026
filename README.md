# Tapestry

A hobby, culture, and language community app — with a recommendation algorithm and a reverse-loneliness matching feature. Not a dating app: no swiping, no looks-based matching.

## Project structure

```
tapestry/
├── index.html          # page shell + load order for scripts
├── css/
│   └── style.css        # all styling (design tokens as CSS variables at the top)
└── js/
    ├── data.js           # constants (tag lists, locations), seed data, storage helpers
    ├── matching.js        # the recommendation scoring function + "why matched" reasons
    ├── ui.js               # all screen rendering (onboarding, discover, groups, events, messages, profile)
    └── app.js               # router entry point, kicks off the first render
```

`data.js`, `matching.js`, and `ui.js` all attach plain functions to the global scope (no bundler, no build step) — `index.html` loads them in the order that matters: data → matching → ui → app.

## How to run it

**Locally, instantly:** just double-click `index.html` — it opens in any browser, no server or install needed.

**To get a live URL to demo from:** drag the whole `tapestry` folder onto [netlify.com/drop](https://app.netlify.com/drop) — you'll get a public link in seconds.

## How the matching works (for judges / your pitch)

`js/matching.js` computes a fully explainable score for every other profile:

- +3 per shared hobby
- +4 per shared culture or language
- +6 if the other person already does something you want to learn (teach/learn match)
- +10 per overlap between what you're missing/need and what they can help with (the reverse-loneliness match)
- minus a small distance penalty (capped, so far-away doesn't zero out a strong match)

The top reverse-loneliness match is pulled out and shown as a dedicated hero card on Discover, separate from the ranked list. Every card also prints the literal reasons behind its score — nothing is a black box.

## Data & privacy notes

This demo uses browser `localStorage`, not a real backend — data lives only in the browser you're using and won't sync across devices. That's intentional for a hackathon demo (it's pre-seeded so it looks alive immediately); a production version would move this to a real database with actual account security.

Location is deliberately neighborhood-level only, never an exact pin. Report and block are available from any profile, message, or event card.

## Roadmap (not built in this demo)

- Real accounts / backend (e.g. Supabase or similar)
- Group chat and live messaging
- Actual content moderation pipeline
- Native mobile apps
