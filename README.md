# 2BAC-PC-11 Rating

The official rating & social hub for **2BAC PC-11** students. Built for rating classmates on looks, visual style, outfits, and personality vibes in a fun, playful, temporary space.

Powered by Firebase Auth (Google) + Cloud Firestore (Spark/Free plan). Hosted on Vercel / GitHub Pages.

---

## Owners & Administration
Only these two authorized emails hold full administrative, publishing, and moderation privileges:
- **Oussama** — Main Owner / CEO
- **Yasser** — Vice President / Co-Owner

*(Owner Gmail addresses remain 100% private and are never exposed publicly on the site).*

All other visitors enter as **Guests** with mandatory nickname selection and community rules acceptance.

---

## Core Features & Updates

### 1. New Concept & Vibe
- **Main Theme**: Playful, casual baddie & vibe check between classmates.
- **Rating Focus**: Looks / visual attractiveness, style & outfits, personality / vibe.
- **Temporary Fun Disclaimer**: Explicitly framed as temporary fun between classmates that will be deleted after a period of time.

### 2. Cutscene-Style Intro
- **Step 1**: Animated greeting with official neon lime atom logo (`logo.jpg`) + *“Hello! Come and rate with us! ✨”*.
- **Step 2**: Rules & community agreement (*“This is a site where we rate girls (and sometimes boys) on looks or personality. It is only for fun and goofing around between us. Be respectful. Do not take it too seriously.”*).

### 3. Anytime Profile Editing
- Users (Owners & Guests) can click their avatar or nickname in the navbar, comments, or settings anytime to:
  - Change their **Nickname**.
  - Update their **Profile Picture** by pasting any direct image URL (with live preview).
  - Update their **Short Bio**.

### 4. Interactive Parallax Galaxy Background
- 3D parallax starfield with glowing neon nebulas that gently responds to mouse movements.
- Respects reduced-motion settings.

### 5. Aspect Ratio & Fullscreen Lightbox (No Cropping)
- Images in detail view display in their real natural aspect ratio (9:16 portrait, landscape, or square) without unwanted cropping.
- Clicking any image opens a distraction-free **Fullscreen Lightbox Viewer**.
- Owners have an aspect ratio framing tool when posting photos.

### 6. Rating Editing
- Guests can change their previous rating anytime by selecting a new score and clicking **Update Vote**.

---

## Deployment & Setup

### Firebase Rules
Copy and paste the contents of `firestore.rules` into your Firebase Console:
1. Open [Firebase Console](https://console.firebase.google.com) → Select project `al-maarifa-3fc45`.
2. **Firestore Database** → **Rules** tab → Paste `firestore.rules` → Click **Publish**.
*(Note: Storage rules do not need modification because image files are never hosted on Firebase Storage).*

### Running Locally or Deploying
- Run with VS Code "Live Server" or any local static server (`npx serve .` or `python -m http.server 3000`).
- Deploy by committing with GitHub Desktop and pushing to GitHub (connected to Vercel).
