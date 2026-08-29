# Tapestry

Connect, chat, and meet up with people who share your interests, culture, and
language — and trade informal teaching/learning with each other. Anonymous
by default: usernames only, with private nicknames for people you connect with.

Built for SYNCS HACK 2026 — theme: "blocks that make up the world."
Every person's interests, culture, and language render as literal stacked
color blocks: their "signature."

## Features

- **Profile setup** — anonymous username, rough neighborhood (not exact
  address), interest tags (hobby / culture / language)
- **Skills** — separate from interest tags: what you can teach vs. what you
  want to learn, each with a proficiency level
- **Match feed** — weighted-tag scoring (`src/lib/matching.js`), shows *why*
  each match scored what it did — language weighted highest, then
  culture/hobby, then neighborhood. Case-insensitive throughout.
- **Search** — find anyone by username or tag, independent of match score
- **Teach & Learn board** — only shows people with an actual trade
  opportunity (someone who can teach what you want to learn, or vice versa),
  matched on shared meaningful words in skill labels; post a "need" (the
  reverse-loneliness feature — matched on a specific stated need, not just
  interests)
- **Connect flow** — real connection requests, accept/decline, private
  nickname, live chat, "suggest a meetup" with place/date/time
- **Contacts** — everyone you've ever reached out to or heard from, in one
  place, so picking up a conversation doesn't mean re-finding someone
- **Profile view/edit** — see and update your signature, tags, and skills
  any time after onboarding
- **Light / dark mode** — toggle in the header, persisted per device
- **Real-time**, backed by Supabase — chat, connection status changes, and
  meetup suggestions all push live with no refresh, across separate devices

## Tech stack

- React + Vite
- Tailwind CSS (theme-reactive color tokens via CSS variables — see
  `tailwind.config.js` / `src/index.css`)
- Supabase — Postgres, Row Level Security, anonymous Auth, Realtime


## Backend setup (Supabase)

The app is wired to a live Supabase project (credentials in
`src/lib/supabaseClient.js` — the anon/public key is safe to ship in client
code; access is governed entirely by Row Level Security). 

No `service_role` key is used anywhere in the client — every read/write goes
through RLS policies scoped to the signed-in device's own profile.

## Project structure

```
src/
  components/       UI — ProfileSetup, ProfileView, MatchFeed, TeachLearnBoard,
                     Contacts, ConnectModal, BlockStack
  lib/
    db.js            All Supabase reads/writes/Realtime subscriptions
    matching.js      Interest-tag match scoring
    skills.js        Teach/learn skill matching + display formatting
    supabaseClient.js
  data/
    mockData.js      Just the tag→color map used by the block-signature visual
supabase/
  schema.sql               Base tables + starter RLS policies
  migration_02_realtime.sql Skills table, missing RLS policies, Realtime config
```

