# Tapestry

Connect, chat, and meet up with people who share your interests, culture, and
language — and trade informal teaching/learning with each other. Anonymous
by default: usernames only, with private nicknames for people you connect with.

Built for SYNCS HACK 2026 — theme: "blocks that make up the world."
Every person's interests, culture, and language render as literal stacked
color blocks: their "signature."

## Run it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Currently runs on mock data (`src/data/mockData.js`)
so the whole flow — profile setup, matching, teach/learn, connect + chat — works
standalone with zero backend setup. Good for your demo right now.

## What's built (demo-ready)

- **Profile setup** — anonymous username, rough neighborhood, tags (hobby / culture / language)
- **Match feed** — weighted-tag scoring (`src/lib/matching.js`), shows *why* each match scored
  what it did — language weighted highest, then culture/hobby, then neighborhood
- **Teach & Learn board** — see what others can teach / want to learn; post a "need"
  (the reverse-loneliness feature — matched on a specific stated need, not just interests)
- **Connect flow** — send request → simulated accept → private nickname → placeholder chat →
  "suggest a meetup" button

## Wiring the real backend (post-hackathon / if you have time left)

1. Create a free project at supabase.com
2. Run `supabase/schema.sql` in the SQL editor
3. `npm install @supabase/supabase-js` (already in package.json)
4. Create `src/lib/supabaseClient.js`:
   ```js
   import { createClient } from '@supabase/supabase-js'
   export const supabase = createClient(YOUR_URL, YOUR_ANON_KEY)
   ```
5. Swap the mock data imports in `MatchFeed.jsx` / `TeachLearnBoard.jsx` for
   Supabase queries against `profiles`, `tags`, `need_posts`.
6. Use Supabase Realtime on the `messages` table for live chat instead of the
   in-memory placeholder in `ConnectModal.jsx`.

## Deploy

```bash
npm run build
```
Push to GitHub, import into Vercel, done — or `npx vercel` directly.

## Demo script (suggested, ~90 sec)

1. Show profile setup — point out anonymity + rough location only (safety)
2. Land on Match Feed — click a match, point at the **highlighted blocks** and
   "Matched on: ..." line — this is your explainable-algorithm moment
3. Switch to Teach & Learn — show a "can teach / want to learn" pair, then
   scroll to a need post ("I miss cooking with my mom") — this is your
   reverse-loneliness differentiator, say it out loud
4. Click Connect → nickname → chat → "Suggest a meetup" — ties back to the
   full loop: connect, chat, meet up in real life
5. Close with the roadmap line: real-time chat + safety/reporting layer via
   Supabase, schema already written (`supabase/schema.sql`)
