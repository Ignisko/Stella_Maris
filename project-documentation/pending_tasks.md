# Stella Maris - Roadmap & Pending Tasks

This document tracks completed visual, spatial, and functional improvements, along with outstanding next steps for future iterations.

## Completed in the Latest Iteration

### 1. Multi-tenant Architecture & Deployment
- **Dual Apps**: Implemented a single codebase that serves two apps: "Stella Maris" (Marian Apparitions) and "Idiota Jezusa" (Eucharistic Miracles) using Vite environment variables.
- **Vercel Deployment**: Added `vercel.json` and customized Vite build scripts (`npm run build:mary`, `npm run build:eucharist`) to ensure correct SPA routing and deployment on Vercel.
- **Social Sharing (Open Graph)**: Injected dynamic OG meta tags (`og:title`, `og:image`, `og:url`) into `index.html` via `.env` variables to fix WhatsApp/Facebook sharing previews.

### 2. Localization & Data
- **Multilingual Support**: Fully implemented multilingual support (English, Polish, Spanish, Turkish, etc.) for UI elements, descriptions, filters, and titles across both applications.
- **Data Integrity**: Cleaned up and verified external URLs, reference links, and documentation sources for both Marian and Eucharistic databases.

### 3. Visual & Interaction Polish
- **Filter Selection Fix**: Fixed the "blue text selection highlight" bug when clicking filter buttons and pills by applying comprehensive `-webkit-tap-highlight-color`, `user-select`, and `outline` CSS resets.
- **Mobile UI Enhancements**: Implemented Google Earth-style minimal bottom toolbars for mobile screens, removing bulky panels and replacing them with compact, touch-friendly circular buttons.

---

## Pending Tasks & Future Roadmaps

### 1. Visual & Responsive Design
- [ ] **Dynamic Window Resizing Re-initialization**: Bind window resize handlers to refresh the timeline bucket width values instantly without requiring a page reload.

### 2. Functional & Interaction Polish
- [ ] **Playback Speed Controls**: Provide speed step multipliers (e.g., 0.5x, 1x, 2x) next to the timeline playback pause/resume button.
- [ ] **Multi-Select Categories**: Allow users to control filter combinations (e.g., select multiple specific Bishop and Vatican categories simultaneously instead of select-all/deselect-all rules).

### 3. Content Expansion
- [ ] **Extended Historical Info**: Integrate external encyclopedia references or historical source links into the details sidebar for all 500+ events.

