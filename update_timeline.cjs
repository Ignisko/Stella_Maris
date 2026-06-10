const fs = require('fs');
const file = 'c:/Users/ignac/Documents/github projects/Catholic_projects/stella-maris/src/components/TimelineOverlay.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Toggles styling
content = content.replace(
  `          {/* Time mode toggle */}
          <div style={{
            display: 'flex', background: 'transparent',
            border: '1px solid var(--timeline-border)',
            borderRadius: '20px',
            overflow: 'hidden'
          }}>`,
  `          {/* Time mode toggle */}
          <div style={{
            display: 'flex', gap: '8px'
          }}>`
);

content = content.replace(
  `                  border: 'none', padding: '6px 16px',
                  fontSize: '9px', fontWeight: 600, cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
                  borderRight: mode === 'modern' ? '1px solid var(--timeline-border)' : 'none',
                  borderRadius: mode === 'modern' ? '20px 0 0 20px' : '0 20px 20px 0'`,
  `                  border: '1px solid var(--timeline-border)', padding: '6px 16px',
                  fontSize: '9px', fontWeight: 600, cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
                  borderRadius: '25px'`
);

// 2. clampedLeft
content = content.replace(
  `const clampedLeft = Math.max(6, Math.min(94, leftPct));`,
  `const clampedLeft = Math.max(10, Math.min(90, leftPct));`
);

// 3. SVG Line
content = content.replace(
  `              {callouts.map(c => {
                let lineX2 = c.left;
                if (c.originalLeft > c.left + 0.5) {
                  lineX2 = c.left + Math.min(3.5, c.originalLeft - c.left);
                } else if (c.originalLeft < c.left - 0.5) {
                  lineX2 = c.left - Math.min(3.5, c.left - c.originalLeft);
                }
                return (
                  <line
                    key={\`svg-line-\${c.id}\`}
                    x1={\`\${c.originalLeft}%\`}
                    y1={300 - c.bottomPx}
                    x2={\`\${lineX2}%\`}
                    y2={300 - (c.bottomPx + c.offset)}
                    stroke="var(--timeline-line)"
                    strokeWidth="1.2"
                  />
                );
              })}`,
  `              {callouts.map(c => {
                return (
                  <line
                    key={\`svg-line-\${c.id}\`}
                    x1={\`\${c.originalLeft}%\`}
                    y1={300 - c.bottomPx}
                    x2={\`\${c.left}%\`}
                    y2={300 - (c.bottomPx + c.offset)}
                    stroke="var(--timeline-line)"
                    strokeWidth="1.2"
                  />
                );
              })}`
);

// 4. Pill logic
content = content.replace(
  `          {/* Callout pills */}
          {!isCinemaMode && callouts.map(c => {
            const bottomPx = c.bottomPx + c.offset;
            // Calculate dynamic translateX to prevent edge clipping and connect beautifully
            let translateX = -50;
            if (c.originalLeft > 85) {
              translateX = -50 - Math.min(40, (c.originalLeft - 85) * 4);
            } else if (c.originalLeft < 15) {
              translateX = -50 + Math.min(40, (15 - c.originalLeft) * 4);
            }

            return (
              <div
                key={\`pill-\${c.id}\`}
                className="interactive-pill"
                onClick={e => { e.stopPropagation(); onSelectApparition(c.famous); }}
                style={{
                  position: 'absolute',
                  left: \`\${c.left}%\`,
                  bottom: \`\${bottomPx}px\`,
                  transform: \`translateX(\${translateX}%)\`,
                  zIndex: 50,
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-color)',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'var(--bg-color)',
                  padding: '5px 12px',
                  border: '1px solid var(--text-color)',
                  borderRadius: '20px',`,
  `          {/* Callout pills */}
          {!isCinemaMode && callouts.map(c => {
            const bottomPx = c.bottomPx + c.offset;

            return (
              <div
                key={\`pill-\${c.id}\`}
                className="interactive-pill"
                onClick={e => { e.stopPropagation(); onSelectApparition(c.famous); }}
                style={{
                  position: 'absolute',
                  left: \`\${c.left}%\`,
                  bottom: \`\${bottomPx}px\`,
                  transform: \`translateX(-50%)\`,
                  zIndex: 50,
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-color)',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'var(--bg-color)',
                  padding: '6px 14px',
                  border: '1px solid var(--text-color)',
                  borderRadius: '25px',`
);

fs.writeFileSync(file, content);
console.log('Stella Maris TimelineOverlay updated successfully.');
