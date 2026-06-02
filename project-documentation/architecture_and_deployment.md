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

## Multi-tenant Differences

While both applications share the same codebase and structure, there are specific differences between the two modes:

### 1. Data Sources
- **Stella Maris (Mary):** Loads Marian apparitions data from `src/data/centuries/` (e.g., Kibeho, Lourdes, Fatima, Guadalupe).
- **Idiota Jezusa (Eucharist):** Loads Eucharistic Miracles data from `src/data/eucharistic-miracles.ts` (e.g., Lanciano, Buenos Aires, Legnica).

### 2. Styling and Theme
- **Stella Maris:** Standard blue styling (`var(--accent-color)` is blue, and timeline buttons / tutorial elements are fully blue).
- **Idiota Jezusa:** Red theme (`primaryColor: '#ef4444'`) for the main accent. The timeline play presentation button and the tutorial onboarding next/start buttons are styled with a vibrant **golden-blue** gradient (`linear-gradient(135deg, #d99726, #3b82f6)`).

### 3. Onboarding Tutorial
- **Stella Maris:** Highlight rings and pulse circles are styled in standard blue to match the theme. Tutorial translations use Marian terminology (Apparitions, Mother of God).
- **Idiota Jezusa:** Highlight rings, pulse circles, and onboarding step icons are styled in **gold** (`#d99726`). Tutorial text content dynamically replaces Marian terms ("apparition", "Stella Maris") with Eucharistic terms ("miracle", "Idiota Jezusa", "Blessed Sacrament").

### 4. Globe Label Clustering
- **Stella Maris:** More dense dataset, so label clustering is tighter with strict priority zones to prevent label collision and clutter.
- **Idiota Jezusa:** Smaller dataset with longer titles, using relaxed clustering constraints (`maxPriority = 5` and a spacing base multiplier of `0.55`) so more miracles remain visible on the globe.
