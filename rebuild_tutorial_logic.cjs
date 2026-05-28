const fs = require('fs');

let tm = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

const updateRectStart = tm.indexOf('const updateRect = () => {');
const updateRectEnd = tm.indexOf('animFrameId = requestAnimationFrame(updateRect);');
const newUpdateRect = `const updateRect = () => {
      let selector = '';
      if (step === 1 || step === 2 || step === 3) selector = '#map-container';
      else if (step === 4) selector = '#action-row-container';
      else if (step === 5) selector = '#filter-tabs-content-container';
      else if (step === 6) selector = '#browse-directory-button';
      else if (step === 7) selector = '#directory-modal-container';
      else if (step === 8) selector = '#timeline-closed-pill';
      else if (step === 9) selector = '#timeline-play-presentation-button';

      if (selector) {
        const el = document.querySelector(selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          setElementRect(prev => {
            if (!prev || prev.left !== rect.left || prev.top !== rect.top || prev.width !== rect.width || prev.height !== rect.height) {
              return rect;
            }
            return prev;
          });
        } else {
          setElementRect(null);
        }
      } else {
        setElementRect(null);
      }
      `;

tm = tm.substring(0, updateRectStart) + newUpdateRect + tm.substring(updateRectEnd);

const cardStyleStart = tm.indexOf('const cardStyle = useMemo');
const cardStyleEnd = tm.indexOf('return common;\n  }, [step, elementRect]);') + 40;

const newCardStyle = `const cardStyle = useMemo((): React.CSSProperties => {
    const common: React.CSSProperties = {
      position: 'fixed',
      zIndex: 130,
      width: '360px',
      backgroundColor: 'rgba(15, 23, 42, 0.96)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--glass-border)',
      borderRadius: '16px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: 'auto'
    };

    if (step === 0 || step === 11) {
      return {
        ...common,
        left: '50vw',
        top: '50vh',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        maxWidth: '90vw',
        textAlign: step === 11 ? 'center' : 'left',
        alignItems: step === 11 ? 'center' : 'stretch'
      };
    }
    
    if (step === 1 || step === 2 || step === 3) {
      return {
        ...common,
        left: '60px',
        top: '150px',
      };
    }

    if (elementRect) {
      switch (step) {
        case 4:
        case 5:
          return {
            ...common,
            left: \`\${elementRect.right + 20}px\`,
            top: \`\${Math.max(20, elementRect.top)}px\`,
          };
        case 6:
          return {
            ...common,
            left: '50px',
            bottom: '30px',
            width: '420px',
          };
        case 7:
          return {
            ...common,
            left: \`\${elementRect.left - 380}px\`,
            bottom: '30px',
          };
        case 8:
          return {
            ...common,
            top: '20vh',
            left: '50vw',
            bottom: 'auto',
            transform: 'translateX(-50%)',
            width: '420px',
          };
        case 9:
          return {
            ...common,
            left: \`\${elementRect.right + 20}px\`,
            bottom: '30px',
          };
      }
    }

    return common;
  }, [step, elementRect]);`;

tm = tm.substring(0, cardStyleStart) + newCardStyle + tm.substring(cardStyleEnd);

fs.writeFileSync('src/components/TutorialModal.tsx', tm);
console.log('Finished rebuilding TutorialModal state loops!');
