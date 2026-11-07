# Najib Fauzan — portfolio

Personal site for a DevSecOps / Platform engineer: a dark, scroll-driven page with a
3D node-network scene (a living cluster with packets moving along its edges), an
animated pipeline diagram, and sections for experience, projects, skills and contact.

Stack: Vite 5, React 18, TypeScript, three.js + @react-three/fiber, Framer Motion.
No backend, no tracking.

## Run locally

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ on http://localhost:4173
```

## Edit content

Everything written on the page lives in **`src/content.ts`**: name, headline,
tagline, about text and facts, the platform diagram stages and gates, experience,
the eight projects, skills, certifications, education and the nav.

Two values you will want to fill in:

- `LINKEDIN_URL` — your LinkedIn profile. Empty hides the link in Contact.
- `PHOTO_URL` — optional portrait. Put the image in `public/` (for example
  `public/photo.jpg`) and set `PHOTO_URL = '/photo.jpg'`. Empty hides the photo.

Colors, fonts and spacing are CSS variables at the top of `src/styles.css`.
The 3D scene's particle budget per device class is in `src/lib/device.ts`.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the site and publishes
`dist/` with `actions/deploy-pages` on every push to `main`.

1. Create the repository `NajibF24/najibf24.github.io` on GitHub (a user site, so the
   page is served from the root and `base: '/'` in `vite.config.ts` is correct).
2. In the repository settings, Pages → Source: **GitHub Actions**.
3. Push:

   ```sh
   git remote add origin git@github.com:NajibF24/najibf24.github.io.git
   git push -u origin main
   ```

If you use a project repository instead (for example `NajibF24/portfolio`), change
`base` in `vite.config.ts` to `'/portfolio/'`.

## Performance and accessibility notes

- The scene is lazy-loaded after first paint and only mounted when WebGL is
  available; otherwise a static gradient background is used.
- Particle counts, pixel ratio and antialiasing scale down on phones and on
  machines with few CPU cores (`src/lib/device.ts`).
- Nodes and packets are instanced meshes; glow is additive point sprites, so there
  is no post-processing pass.
- The render loop stops when the tab is hidden.
- With `prefers-reduced-motion: reduce` the scene renders one static frame and all
  entrance animations, tilt effects and diagram packets are disabled.
