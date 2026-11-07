# 2BAC-PC-11 Rating

Single-file web application for 2BAC PC-11 students and friends to showcase and rate photos based on creativity, quality, editing, and presentation.

Powered by Firebase Auth (Google) + Cloud Firestore (Spark/Free plan). Hosted on Vercel / GitHub Pages.

---

## Owners & Administration
Only these two authorized emails hold full administrative, publishing, and moderation privileges:
- `anaflousoussama555@gmail.com` — **Main Owner / CEO**
- `Yagsahz@gmail.com` / `yagsahz@gmail.com` — **Vice President / Co-Owner**

All other visitors enter as **Guests** with mandatory nickname selection and community rules acceptance.

---

## Deployment & Setup

### 1. Firebase Rules (IMPORTANT)
Whenever rules are updated, copy and paste the contents into the Firebase Console:
1. Open [Firebase Console](https://console.firebase.google.com) → Select project `al-maarifa-3fc45`.
2. **Firestore Database** → **Rules** tab → Paste the contents of `firestore.rules` → Click **Publish**.
3. **Storage** → **Rules** tab → Paste the contents of `storage.rules` → Click **Publish**.

### 2. Running Locally or Deploying
- Run with VS Code "Live Server" or any local static server (`npx serve .` or `python -m http.server 3000`).
- Deploy by committing with GitHub Desktop and pushing to GitHub (connected to Vercel).

---

## Core Guidelines
- **URL-Based Images Only**: The platform stores direct image URLs (from `postimages.org` or `imgto.link`), never hosting image files on Firebase Storage.
- **Ethics Rule**: Ratings are strictly focused on image creativity, editing, and presentation — never physical appearance.
