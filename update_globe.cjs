const fs = require('fs');

let globe = fs.readFileSync('src/components/GlobeViewer.tsx', 'utf8');

// 1. Fix Camera Zoom logic
// Step 1: Explore (Altitude 2.2)
// Step 2: Auto-rotate (Altitude 2.2)
// Step 3: Zoom (Altitude 0.35)
// Step 4: Click apparition (Altitude 0.35)

const oldCameraLogic = `    if (isTutorialActive && (tutorialStep === 1 || tutorialStep === 2 || tutorialStep === 3) && globeEl.current) {
      setIsAutoRotate(tutorialStep === 1);
      if (globeEl.current.controls()) {
        globeEl.current.controls().autoRotate = (tutorialStep === 1);
      }
      globeEl.current.pointOfView({ lat: 15, lng: -90, altitude: 2.2 }, 1200);
    }`;
    
const newCameraLogic = `    if (isTutorialActive && (tutorialStep === 1 || tutorialStep === 2) && globeEl.current) {
      setIsAutoRotate(tutorialStep === 1);
      if (globeEl.current.controls()) {
        globeEl.current.controls().autoRotate = (tutorialStep === 1);
      }
      globeEl.current.pointOfView({ lat: 15, lng: -90, altitude: 2.2 }, 1200);
    } else if (isTutorialActive && (tutorialStep === 3 || tutorialStep === 4) && globeEl.current) {
      setIsAutoRotate(false);
      if (globeEl.current.controls()) {
        globeEl.current.controls().autoRotate = false;
      }
      globeEl.current.pointOfView({ lat: 19.484, lng: -99.117, altitude: 0.35 }, 2000);
    }`;

globe = globe.replace(oldCameraLogic, newCameraLogic);

// 2. Fix the auto-rotate button visibility (Step 2 -> Step 2, Old Step 3 -> Step 3, Old Step 9 -> Step 10)
globe = globe.replace(
  `(!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 3 || tutorialStep === 9))`,
  `(!hidePlayPause && (!isTutorialActive || tutorialStep === 2 || tutorialStep === 3 || tutorialStep === 10))`
);
globe = globe.replace(
  `tutorialStep === 2 || tutorialStep === 3) ? '0 0 0 4px`,
  `tutorialStep === 2 || tutorialStep === 3) ? '0 0 0 4px` // actually this doesn't change since the button glow is for step 2 & 3. Wait, maybe also for step 4? No, step 4 is about clicking Guadalupe. So step 2 and 3 is fine for the glow.
);

// 3. Fix the Tutorial Pointer Arrow & Clickability
const oldPointerLogic = `            const isTutorialTarget = isTutorialActive && tutorialStep === 3 && d.id === 'guadalupe_mexico';
            const tutorialPointerHtml = isTutorialTarget ? \`
              <div class="tutorial-click-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 22 13 13l4-7-13 4 5 5-3 9 7-2 3-5Z"/></svg>
              </div>
            \` : '';`;
            
const newPointerLogic = `            const isTutorialTarget = isTutorialActive && tutorialStep === 4 && d.id === 'guadalupe_mexico';
            const tutorialPointerHtml = isTutorialTarget ? \`
              <div class="tutorial-click-pointer" style="position: absolute; top: -60px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; animation: floatArrow 1.5s ease-in-out infinite; pointer-events: none;">
                <div style="background: var(--accent-color); color: white; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; white-space: nowrap; box-shadow: 0 4px 12px rgba(56,189,248,0.6); margin-bottom: 6px; letter-spacing: 0.5px;">KLIKNIJ / CLICK</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                <style>
                  @keyframes floatArrow {
                    0%, 100% { transform: translate(-50%, 0); }
                    50% { transform: translate(-50%, -8px); }
                  }
                </style>
              </div>
            \` : '';`;

globe = globe.replace(oldPointerLogic, newPointerLogic);

// 4. Disable Click on Step 3
const oldClickDot = `            const dot = el.querySelector('.marker-dot') as HTMLElement;
            if (dot) {
              dot.onpointerdown = (e) => {
                e.stopPropagation();
                lastClickTimeRef.current = Date.now();
                handlePointClick(d);
              };
              dot.onclick = (e) => {
                e.stopPropagation();
                lastClickTimeRef.current = Date.now();
                handlePointClick(d);
              };
            }`;
            
const newClickDot = `            const dot = el.querySelector('.marker-dot') as HTMLElement;
            if (dot) {
              const handleDotClick = (e) => {
                e.stopPropagation();
                if (isTutorialActive && tutorialStep === 3) return; // Prevent clicking during step 3 zoom
                lastClickTimeRef.current = Date.now();
                handlePointClick(d);
              };
              dot.onpointerdown = handleDotClick;
              dot.onclick = handleDotClick;
            }`;

globe = globe.replace(oldClickDot, newClickDot);

const oldClickContent = `            const content = el.querySelector('.label-content') as HTMLElement;
            if (content) {
              content.onpointerdown = (e) => {
                e.stopPropagation();
                lastClickTimeRef.current = Date.now();
                handlePointClick(d);
              };
              content.onclick = (e) => {
                e.stopPropagation();
                lastClickTimeRef.current = Date.now();
                handlePointClick(d);
              };
            }`;
            
const newClickContent = `            const content = el.querySelector('.label-content') as HTMLElement;
            if (content) {
              const handleContentClick = (e) => {
                e.stopPropagation();
                if (isTutorialActive && tutorialStep === 3) return; // Prevent clicking during step 3 zoom
                lastClickTimeRef.current = Date.now();
                handlePointClick(d);
              };
              content.onpointerdown = handleContentClick;
              content.onclick = handleContentClick;
            }`;

globe = globe.replace(oldClickContent, newClickContent);

// Shift timeline play/pause logic from step 11 to 12 in GlobeViewer if it exists
globe = globe.replace(/tutorialStep === 11/g, 'tutorialStep === 12');

fs.writeFileSync('src/components/GlobeViewer.tsx', globe);
console.log('Finished updating GlobeViewer logic!');
