# Al Maarifa — School Social Rating (prototype)

Single-file app. No build step. Firebase (Auth + Firestore + Storage).

## 1. Firebase setup (free)
1. console.firebase.google.com → Add project → "al-maarifa".
2. Add a Web app (`</>`) → copy the `firebaseConfig` object.
3. Authentication → Sign-in method → enable Google.
4. Firestore Database → Create database → production mode → pick region.
5. Storage → Get started.

## 2. Paste credentials
Open `index.html`, find the `FIREBASE CONFIG` block, replace the `YOUR_*` placeholders with your config values. `ADMIN_EMAIL` is already set to `anaflousoussama555@gmail.com`.

## 3. Security rules
- Firestore: paste contents of `firestore.rules` into Firebase console → Firestore → Rules → Publish.
- Storage: paste contents of `storage.rules` into Firebase console → Storage → Rules → Publish.

## 4. Run locally (optional)
Install VS Code + "Live Server" extension → right-click `index.html` → "Open with Live Server" (http://127.0.0.1:5500). Firebase Auth works on localhost.

## 5. Deploy free on Vercel
Push this folder to a GitHub repo → vercel.com → New Project → import → Framework Preset: Other → Deploy. Add your Vercel domain to Firebase → Authentication → Settings → Authorized domains.

## 6. Deploy free on GitHub Pages (alternative)
Repo → Settings → Pages → Source: main / root → Save. Add `username.github.io` to Firebase Authorized domains.

## Owner abilities
When signed in as `anaflousoussama555@gmail.com`, every profile card's "Open" modal shows Warn / Ban-Hide / Delete buttons. Rules enforce admin-only writes server-side.
