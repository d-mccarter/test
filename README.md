# Calc

A simple web calculator with basic arithmetic: add, subtract, multiply, and divide.

## Open on iPhone / iPad

Once GitHub Pages is deploying the built app, open this URL in Safari:

**https://d-mccarter.github.io/test/**

Tips:
1. Merge this repo’s Pages deploy workflow to `main` (or push the deploy setup yourself).
2. In the repo: **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
3. Wait for the **Deploy to GitHub Pages** Action to finish (green check on the Actions tab).
4. On your iPhone, open Safari and go to `https://d-mccarter.github.io/test/`.
5. Optional: tap the Share button → **Add to Home Screen** for an app-like icon.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

`npm run build` outputs static files to `dist/`. GitHub Actions builds this folder and publishes it to Pages.
