# OrbitScope: Real-Time ISS & News Dashboard

A production-ready React + Vite dashboard for live International Space Station tracking, latest news, analytics charts, and a floating AI assistant that answers only from loaded dashboard data.

## Description

OrbitScope is a production-ready full-stack Real-Time ISS & News Dashboard built with React, Vite, Tailwind CSS, Leaflet, Chart.js, Framer Motion, and Vercel serverless APIs. The application provides a modern NASA-inspired analytics experience where users can track the International Space Station live, view its current latitude and longitude, monitor calculated orbital speed, visualize its recent trajectory on an interactive map, and see the people currently in space.

The dashboard also includes a latest-news section with searchable and sortable article cards, localStorage caching, loading skeletons, retry handling, and responsive layouts. Interactive charts provide visual insights into ISS speed trends and news distribution by source.

A floating AI chatbot is included to answer only questions related to the currently loaded dashboard data, such as ISS location, speed, astronauts, and news articles. The app supports dark and light themes, smooth animations, mobile-first responsive design, offline indicators, keyboard shortcuts, and Vercel-ready deployment.

## Features

- Live ISS position refresh every 15 seconds
- Leaflet map with animated ISS marker and recent trajectory
- ISS speed calculation using the Haversine formula
- Reverse geocoded nearest location or ocean region
- People currently in space panel
- Latest news dashboard with search, sorting, skeletons, errors, retries, and 15-minute localStorage cache
- Dashboard-aware Hugging Face chatbot with persisted messages and export
- ISS speed chart, news distribution chart, theme persistence, keyboard shortcuts, live clock, PWA manifest, and offline fallback

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL shown by Vite.

## Environment Variables

```bash
VITE_NEWS_API_KEY=your_newsapi_or_eventregistry_key
VITE_AI_TOKEN=your_hugging_face_token
```

For production on Vercel, prefer server-side variables too:

```bash
NEWS_API_KEY=your_newsapi_or_eventregistry_key
AI_TOKEN=your_hugging_face_token
```

The app uses `/api/news`, `/api/iss`, `/api/astros`, and `/api/chat` serverless functions when available. Browser-side fallbacks are included for local development.

## Deploy to Vercel

```bash
npm install -g vercel
vercel
vercel --prod
```

Set the environment variables in the Vercel dashboard before production deployment.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Screenshots

Add screenshots after deployment:

- `screenshots/dashboard-dark.png`
- `screenshots/dashboard-light.png`
- `screenshots/mobile-chat.png`

## API Notes

- ISS data: Open Notify style endpoints, proxied through Vercel to avoid mixed-content issues.
- Reverse geocoding: OpenStreetMap Nominatim public endpoint.
- News: NewsAPI-style response first, Event Registry-style response fallback.
- AI: Hugging Face `mistralai/Mistral-7B-Instruct-v0.2`, constrained by prompt and client-side routing to dashboard data only.
