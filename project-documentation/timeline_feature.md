# Feature Documentation: Interactive Timeline & Histogram Callout Overlay

## Status
Complete

## Links & References
**Related Files:**
- `src/components/TimelineOverlay.tsx` (Main UI component, histogram rendering, callout positioning)
- `src/utils/colors.ts` (Color utilities and status category formatting)
- `src/data/apparitions.ts` (Underlying apparition dataset)

## Problem Statement
In interactive visualization maps with temporal datasets (such as Marian apparitions spanning from 40 AD to the present), standard timeline sliders only show year ranges without revealing the volume of activity or highlighting pivotal historical events. Furthermore, rendering text callout boxes directly inside CSS flex columns causes severe z-index stacking conflicts, clipping, and overlapping text labels when adjacent events occur within close proximity.

## Solution Overview
The Interactive Timeline Overlay provides a dual-mode, collapsible activity graph at the bottom of the map interface:
1. **Collapsible Activity Histogram**: Groups apparitions into exact temporal buckets and displays colorful stacked tiles corresponding to church approval statuses.
2. **Dual-Mode Zoom**: Allows users to seamlessly toggle between 'Modern era (1800-Present)' and 'Full history (40 AD-Present)'.
3. **Famous Event Callouts**: Highlights key landmarks (e.g., Our Lady of Miraculous Medal, Our Lady of Lourdes, Our Lady of Fatima) using elegant white pinning lines connected directly to the histogram tiles and floating title pills that open detailed inspection popups when clicked.

## Architecture Integration
**Where this fits in the overall app:**
This feature sits at the top UI layer (`zIndex: 25`) as an absolute floating glassmorphic panel overlaying the 3D globe. It communicates directly with the parent map container via `onSelectApparition` to trigger globe camera fly-to animations and open the details sidebar.

**Data flow:**
`apparitions dataset` -> Filtered by `timeMode` ('modern' vs 'all') -> Grouped into ~115 temporal `buckets` -> Histogram tiles rendered per bucket -> Callout positions calculated based on active bucket height + configurable `FAMOUS_CALLOUTS` offsets.

## Core Components

### `TimelineOverlay` (`src/components/TimelineOverlay.tsx`)
**Purpose:** Manages the entire timeline lifecycle, expansion state, time mode toggling, and multi-layer rendering.
**Input:** `apparitions` (full array), `selectedApparition` (currently active selection), `onSelectApparition` (callback).
**Output:** Rendered DOM structure comprising the header controls, era infoboxes, histogram bars, white pinning lines, title pills, and horizontal axis line.

### `FAMOUS_CALLOUTS` Configuration
**Purpose:** A centralized dictionary mapping landmark apparition IDs to human-readable titles, years, and dual height offsets.
**Structure:**
```tsx
const FAMOUS_CALLOUTS: Record<string, { label: string; year: number; modernOffset: number; fullHistoryOffset: number }> = {
  "rue-du-bac-1830": { label: "Our Lady of Miraculous Medal", year: 1830, modernOffset: 12, fullHistoryOffset: 25 }, ...
};
```
- `modernOffset`: The vertical height offset (in px) applied in Modern Era view.
- `fullHistoryOffset`: The vertical height offset (in px) applied in Full History view to prevent horizontal crowding.

## Implementation Details
**Key Layout Mechanics:**
- **Absolute Layering**: To prevent CSS stacking context isolation between year columns, all callout lines and title pills are rendered in an absolute overlay (`zIndex: 100`) sitting completely outside the histogram column structure. Layer 1 renders all white lines (`zIndex: 1`) and Layer 2 renders all text pills (`zIndex: 50`), guaranteeing perfect text-over-line stacking.
- **Precise Grounding**: The bottom of each white pinning line is calculated exactly as `b.apps.length * (tileHeight + 2)` pixels, ensuring the line connects perfectly to the top tip of the stacked colorful tiles.
- **Flush Axis Alignment**: The histogram container has `marginBottom: 0` and `paddingBottom: '1px'`, while the horizontal axis has `marginTop: '2px'`, allowing the colorful tiles to rest cleanly and flush against the white timeline axis.

## Testing Approach
**How to test this feature:**
1. **Modern View Verification**: Open the app with no apparition selected. Verify that Miraculous Medal (1830), Zion (1842), and Lourdes (1858) form clean, non-overlapping stair-stepped tiers.
2. **Full History View Verification**: Click 'Full history (40 AD-Present)'. Verify that the graph automatically switches to `fullHistoryOffset` and maintains clear vertical separation across the compressed right-hand cluster.
3. **Axis Verification**: Inspect the bottom of the colorful tiles to confirm they rest flush against the axis line.

## Known Issues & Future Improvements
**Current limitations:**
- Extremely dense clusters in Full History view require taller stair-stepped offsets (`fullHistoryOffset`) to maintain visual clarity when the window width is compressed below 1000px.

**Planned improvements:**
- Responsive scaling for `modernOffset` and `fullHistoryOffset` based on viewport width breakpoints.

## Risks & Considerations
**User impact:**
- Provides an extremely premium, polished visual experience that encourages exploration and discovery without visual clutter.

---
**Created:** May 16, 2026 by Antigravity
**Last Updated:** May 16, 2026 by Antigravity
