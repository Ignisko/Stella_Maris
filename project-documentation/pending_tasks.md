# Stella Maris - Roadmap & Pending Tasks

This document tracks completed visual, spatial, and functional improvements, along with outstanding next steps for future iterations.

## Completed in the Latest Iteration

### 1. Timeline & Histogram Optimization
- **Deck-of-Cards Tile Dimensions**: Configured dynamic `tileWidth` and `tileHeight` ratios to maintain portrait-oriented rectangular blocks (deck-of-cards dimensions) in both Modern and Full History views, resolving flat "striped" block compression.
- **Adaptive Tile Spacing**: Introduced dynamic column gaps (`tileGap` from `0.75px` to `1.5px`) based on column height and data density.
- **Solid Connecting Lines**: Replaced dashed/striped connecting lines with solid vertical gradient lines that rise directly up from the timeline bars ("pushed on line").
- **Compact Panel Height**: Scaled the timeline chart container down to `120px` to increase the visible vertical field of view of the 3D globe.
- **Clamped Pill Offsets**: Handled boundaries to prevent text container clipping for right-aligned famous callouts (e.g., "Mother of the Word").
- **Upward Chevron Symbol**: Changed the collapsed timeline button icon from a downward arrow ("v" / ChevronDown) to an upward arrow ("^" / ChevronUp) to clearly indicate that clicking expands the timeline panel upward.

### 2. Camera Controls & Floating Alignment
- **Centered Camera Offsets**: Introduced responsive camera latitude offsets (`selectedLat - 14` when the timeline is open) so selected pins fly to the upper viewport area, avoiding obstruction by the bottom overlay.
- **Aligned Pause/Play Controls**: Positioned the globe auto-rotate control button at the same bottom height (`20px`) as the collapsed timeline button, and programmed it to dynamically slide up to `268px` when the timeline panel expands to rest perfectly above its top edge.
- **Stacking Context Isolation Fix**: Extracted the rotation play/pause button out of the Three-Globe canvas container's stacking context wrapper, resolving the issue where it was occluded and rendered un-clickable beneath the glassmorphism backdrop of the expanded timeline.


### 3. Globe Label Proximity & Density
- **Altitude-Based Spacing**: Linked geographical label cluster spacing (`CLUSTER_DEG` from `1.2` to `12.0` degrees) directly to the zoom/altitude state (`lodThreshold`), ensuring labels dynamically show up when dataset density is low but never overlap when zoomed out.
- **Selection Proximity Exclusion**: Filtered out labels in the immediate proximity of the active selected location (using an altitude-scaled degree radius) to guarantee the highlighted card is never covered.

---

## Pending Tasks & Future Roadmaps

### 1. Visual & Responsive Design
- [ ] **Ultra-Narrow Screen Breakpoints**: Define collapsible UI states or alternative scrolling lists for the timeline when viewed on mobile screens (<640px wide).
- [ ] **Dynamic Window Resizing Re-initialization**: Bind window resize handlers to refresh the timeline bucket width values instantly without requiring a page reload.

### 2. Functional & Interaction Polish
- [ ] **Playback Speed Controls**: Provide speed step multipliers (e.g., 0.5x, 1x, 2x) next to the timeline playback pause/resume button.
- [ ] **Multi-Select Categories**: Allow users to control filter combinations (e.g., select multiple specific Bishop and Vatican categories simultaneously instead of select-all/deselect-all rules).

### 3. Data & Localization
- [ ] **Multilingual Support**: Add language toggles (e.g., English, Polish, Spanish) for titles, sidebar content, and status descriptions.
- [ ] **Extended Historical Info**: Integrate external encyclopedia references or historical source links into the details sidebar for all 500+ events.
