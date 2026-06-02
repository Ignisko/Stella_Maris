# Project Architecture & Deployment

## Multi-tenant Architecture

This repository hosts two distinct Web Applications built from the same core codebase:
1. **Stella Maris** (Marian Apparitions)
2. **Idiota Jezusa** (Eucharistic Miracles)

The app uses Vite environment variables (`.env.mary` and `.env.eucharist`) to determine which data to load and how to style the application.

### Build Scripts
- `npm run dev:mary` - Runs local dev server for Stella Maris
- `npm run dev:eucharist` - Runs local dev server for Idiota Jezusa
- `npm run build:mary` - Builds the production bundle for Stella Maris
- `npm run build:eucharist` - Builds the production bundle for Idiota Jezusa

## Deployment (Vercel)

The application is deployed on **Vercel**, connected directly to the GitHub repository.

### Vercel Configuration
A `vercel.json` file is located at the root of the project to properly instruct Vercel on how to build and serve the application:
- **Build Command:** Vercel automatically runs `npm run build:mary` (or the equivalent command set in the Vercel dashboard) to generate the `dist` folder.
- **Output Directory:** `dist`
- **Routing:** Vercel rewrites all incoming routes to `/index.html` to support the Single Page Application (SPA) routing.

### Meta Tags and Social Sharing (Open Graph)
The `index.html` file uses Vite's HTML environment replacement to dynamically inject:
- `%VITE_APP_TITLE%`
- `%VITE_APP_URL%`
- `%VITE_APP_OG_IMAGE%`
- `%VITE_APP_DESCRIPTION%`

This ensures that when the link is shared on platforms like WhatsApp, Facebook, or Twitter, the correct title, description, and absolute image URL are scraped and displayed as a rich preview.

**Note:** If the title shows up as `%VITE_APP_TITLE%` in the browser tab, it means the raw source `index.html` was served without running the Vite build process. The `vercel.json` configuration ensures Vercel properly builds the app and serves the built `dist/index.html`.
