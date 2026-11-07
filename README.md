# Al Maarifa — School Social Rating

Single-file app (no build step). Firebase Auth + Firestore only (Spark/free plan, no credit card).

## Setup
1. Create Firebase project → enable Google Auth → create Firestore DB (production mode).
2. Paste your `firebaseConfig` into `index.html` (already filled for `al-maarifa-3fc45`).
3. Publish `firestore.rules` to Firebase console → Firestore → Rules.
4. Run locally with VS Code "Live Server", or push to GitHub Pages / Vercel.

## Admin / Owner
Signed-in account `anaflousoussama555@gmail.com` unlocks Warn / Ban-Hide / Delete / Review Reports on every profile.

## Email notifications for reports (optional, free)
Reports are always saved to Firestore. To also get an email at `anaflousoussama555@gmail.com`:
1. Create a free account at https://www.emailjs.com
2. Add an Email Service (Gmail) and an Email Template with variables: `to_email`, `image_url`, `post_id`, `reason`, `details`, `reported_user`, `reporter`.
3. Put the Service ID, Template ID, and Public Key into `EMAILJS_SERVICE`, `EMAILJS_TEMPLATE`, `EMAILJS_PUBLIC_KEY` in `index.html`.

## Notes
- No Firebase Storage: images are pasted URLs (host via imgto.link or postimages.org).
- Theme + language (EN/FR/Darija with RTL) persist in localStorage.
- Ratings are decimal 0.1–10.0; reactions are separate from ratings.
