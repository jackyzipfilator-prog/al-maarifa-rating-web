# 2BAC-PC-11 Rating

The official social creativity showcase & rating web app for **2BAC PC-11** students and friends. Designed for celebrating creativity, photography skills, image editing, and shared memories.

Powered by Firebase Auth (Google) + Cloud Firestore (Spark/Free plan). Hosted on Vercel / GitHub Pages.

---

## Owners & Administration
Only these two authorized emails hold full administrative, publishing, and moderation privileges:
- `anaflousoussama555@gmail.com` — **Main Owner / CEO** (Oussama)
- `Yagsahz@gmail.com` / `yagsahz@gmail.com` — **Vice President / Co-Owner** (Yasser)

All other visitors enter as **Guests** with mandatory nickname selection and community rules acceptance.

---

## Implemented Features Across All Phases (Complete)

### Phase 1 — Foundation & Core Identity
* **Official Branding**: Neon lime atom hexagon logo (`logo.jpg`), dark space theme, and prominent green CEO & Co-Owner badges.
* **Dual-Owner Security**: Only the two owners can publish new photos, ban/warn, or delete.
* **Guided Onboarding**: Mandatory ethics agreement (*"Rate creativity, editing, and presentation — never physical appearance"*) and mandatory nickname.
* **Algorithmic Feed**: Chronological "Feed" removed; "Recommended" virality feed with recency boost promoted to default.
* **0.1–10.0 Rating System**: Atomic 1-vote-per-guest protection with quick-rate shortcut buttons.

### Phase 2 — Social Experience & Moderation
* **Instagram-Style Comments**:
  * Comment pinning by owners (pins to top with a 📌 badge).
  * Live sorting by Top Liked, Newest, and Oldest.
  * Inline comment editing with `(edited)` markers.
  * Threaded replies with `@Nickname` targeting.
  * Separate comment reporting and liking.
* **Saved Bookmarks Collection**: Private bookmarking tab for students to save their favorite photos.
* **In-App Notifications**: Header bell notification badge for official updates and announcements.
* **Owner Moderation Queue**: Dedicated queue with search and reason filters.

### Phase 3 — Visual Polish, Motion & Audio Synthesizer
* **Web Audio API Synthesizer**: Pure in-browser sound effects for votes, reactions, and clicks (off by default, toggleable in Settings with a sound preview button).
* **Confetti & Particle Bursts**: Neon particle burst animations on rating submission and celebrations.
* **Shimmer Placeholders**: Restrained shimmer loading skeletons while external images load.
* **Keyboard Shortcuts**: `Escape` closes any modal; `Ctrl+K` or `/` instantly focuses search.
* **Accessibility**: Reduced-motion toggle in Settings.

### Phase 4 — Community Extras & Expansion
* **About & Community Rules / FAQ Modal**: Dedicated guide explaining the rating philosophy, privacy, and team.
* **Student Idea & Suggestion Box**: Students can submit feature requests or feedback directly to Oussama and Yasser.
* **Owner Ideas Viewer**: Tab inside the Moderation Queue to review student suggestions.
* **Photo Link Sharing**: One-click link copying to share direct photo links with classmates.
* **What's New Changelog**: Version history viewer.

---

## Deployment & Setup

### 1. Firebase Rules (IMPORTANT)
Copy and paste the contents of `firestore.rules` into your Firebase Console:
1. Open [Firebase Console](https://console.firebase.google.com) → Select project `al-maarifa-3fc45`.
2. **Firestore Database** → **Rules** tab → Paste `firestore.rules` → Click **Publish**.
*(Note: Storage rules do not need modification because image files are never hosted on Firebase Storage).*

### 2. Running Locally or Deploying
- Run with VS Code "Live Server" or any local static server (`npx serve .` or `python -m http.server 3000`).
- Deploy by committing with GitHub Desktop and pushing to GitHub (connected to Vercel).

---

## Core Guidelines
- **URL-Based Images Only**: The platform stores direct image URLs (from `postimages.org` or `imgto.link`), never hosting image files on Firebase Storage.
- **Ethics Rule**: Ratings are strictly focused on image creativity, editing, and presentation — never physical appearance.
