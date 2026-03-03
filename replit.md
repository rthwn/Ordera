# Blockchain Poster - Product Landing Page

## Overview
A product-focused poster/landing page showcasing the "Optimised Blockchain Network for Use-Case Specific Transaction Prioritization" capstone project. Built as a single-page React application with smooth animations and dark/light theme support.

## Architecture
- **Frontend-only**: No backend data persistence needed - purely static content display
- **Single page**: `client/src/pages/poster.tsx` contains the full poster
- **Theme**: Dark mode default with toggle, blockchain-inspired blue/teal color scheme

## Key Sections
1. Hero with project title and key stats
2. Problem statement (why existing blockchains fall short)
3. Six key innovations
4. Three-layer architecture overview
5. Priority model with interactive expandable cards
6. Gas fee model with sigmoid formula and data table
7. Batching strategy visualization
8. Competitive comparison table (vs Bitcoin, Ethereum, Solana, Polkadot)
9. Results and block visualization
10. Technology stack

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS with custom theme tokens
- Framer Motion for scroll animations
- Shadcn UI components (Card, Badge, Button)
- Lucide React icons
- Inter font (sans), JetBrains Mono (mono)

## Running Locally
`npm run dev` starts both Express backend and Vite frontend dev server

## GitHub Pages Deployment
The `docs/` folder contains the pre-built static site ready for GitHub Pages.

### Build for GitHub Pages
```bash
npx vite build --config vite.ghpages.config.ts
cp docs/index.html docs/404.html
touch docs/.nojekyll
```

### GitHub Setup Steps
1. Push this entire repo to a GitHub repository
2. Go to repo Settings > Pages
3. Under "Build and deployment", set Source to "Deploy from a branch"
4. Set Branch to `main` and folder to `/docs`
5. Click Save — your site will be live at `https://<username>.github.io/<repo-name>/`

### Files
- `vite.ghpages.config.ts` - Vite config for static GitHub Pages build (uses relative `./` base path)
- `docs/` - Pre-built static output folder served by GitHub Pages
- `docs/.nojekyll` - Tells GitHub Pages to skip Jekyll processing
- `docs/404.html` - Copy of index.html for SPA client-side routing
