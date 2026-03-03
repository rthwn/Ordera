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

## Running
`npm run dev` starts both Express backend and Vite frontend dev server
