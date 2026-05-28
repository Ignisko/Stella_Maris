const fs = require('fs');
let tut = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

// 1. Fix updateRect
const updateRectBlock = `    const updateRect = () => {
      let selector = '';
      if (step === 2) selector = '#auto-rotate-button';
      else if (step === 5) selector = '#apparition-sidebar';
      else if (step === 6) selector = '#search-filters-container';
      else if (step === 7) selector = '#browse-directory-button';
      else if (step === 8) selector = '#directory-modal-container';
      else if (step === 9) selector = '#timeline-closed-pill';
      else if (step === 10) selector = '#timeline-play-presentation-button';

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
      animFrameId = requestAnimationFrame(updateRect);
    };`;

tut = tut.replace(/const updateRect = \(\) => \{[\s\S]*?animFrameId = requestAnimationFrame\(updateRect\);\n\s*\};/, updateRectBlock);

// 2. Fix highlightStyle
const highlightStyleBlock = `  const highlightStyle = useMemo((): React.CSSProperties => {
    if (step === 0 || step === 11) {
      return {
        left: '-100px',
        top: '-100px',
        width: '0px',
        height: '0px',
        border: 'none',
        boxShadow: '0 0 0 9999px rgba(5, 8, 22, 0.75)',
        background: 'transparent',
      };
    }
    if (step === 1 || step === 3 || step === 4) {
      return {
        left: '50vw',
        top: '50vh',
        width: '500px',
        height: '500px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'transparent',
      };
    }
    if (elementRect) {
      let paddingT = 6;
      let paddingB = 6;
      const paddingL = 6;
      const paddingR = 6;

      if (step === 6) {
        paddingT = 2;
        paddingB = 10;
      }
      
      let br = '12px';
      if (step === 2 || step === 9) br = '30px'; // pill buttons

      return {
        left: \`\${elementRect.left - paddingL}px\`,
        top: \`\${elementRect.top - paddingT}px\`,
        width: \`\${elementRect.width + paddingL + paddingR}px\`,
        height: \`\${elementRect.height + paddingT + paddingB}px\`,
        borderRadius: br,
        background: 'transparent',
      };
    }
    return { display: 'none' };
  }, [step, elementRect]);`;

tut = tut.replace(/const highlightStyle = useMemo\(\(\): React\.CSSProperties => \{[\s\S]*?return \{ display: 'none' \};\n\s*\}, \[step, elementRect\]\);/, highlightStyleBlock);

// 3. Fix cardStyle
const cardStyleBlock = `  const cardStyle = useMemo((): React.CSSProperties | null => {
    if (step === 11 || !elementRect && ![0,1,3,4,11].includes(step)) return null;

    const common: React.CSSProperties = {
      position: 'absolute',
      background: 'rgba(15, 23, 42, 0.95)',
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
    if (step === 1 || step === 3 || step === 4) {
      return {
        ...common,
        left: '60px',
        top: '150px',
        width: '420px',
      };
    }

    if (elementRect) {
      switch (step) {
        case 2:
          return {
            ...common,
            left: \`\${elementRect.left}px\`,
            bottom: '80px',
            width: '420px',
          };
        case 5:
        case 6:
          return {
            ...common,
            left: \`\${elementRect.right + 20}px\`,
            top: \`\${elementRect.top}px\`,
            width: '420px',
          };
        case 7:
          return {
            ...common,
            left: '50px',
            bottom: '30px',
            width: '420px',
          };
        case 8:
          return {
            ...common,
            left: \`\${elementRect.left - 440}px\`,
            bottom: '30px',
            width: '420px',
          };
        case 9:
          return {
            ...common,
            top: '20vh',
            left: '50vw',
            bottom: 'auto',
            transform: 'translateX(-50%)',
            width: '420px',
          };
        case 10:
          return {
            ...common,
            left: \`\${elementRect.right + 20}px\`,
            bottom: '30px',
            width: '420px',
          };
      }
    }
    return common;
  }, [step, elementRect]);`;

tut = tut.replace(/const cardStyle = useMemo\(\(\): React\.CSSProperties \| null => \{[\s\S]*?return common;\n\s*\}, \[step, elementRect\]\);/, cardStyleBlock);

// 4. Fix arrowStyle
const arrowStyleBlock = `  const arrowStyle = useMemo((): React.CSSProperties | null => {
    if (step === 0 || step === 1 || step === 3 || step === 4 || step === 11 || !elementRect) return null;

    const base: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (step) {
      case 2:
        return {
          ...base,
          bottom: '-10px',
          left: '40px',
          borderWidth: '10px 10px 0 10px',
          borderColor: 'rgba(15, 23, 42, 0.96) transparent transparent transparent',
        };
      case 5:
      case 6:
        return {
          ...base,
          top: '30px',
          left: '-10px',
          borderWidth: '10px 10px 10px 0',
          borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',
        };
      case 8:
        return {
          ...base,
          bottom: '24px',
          right: '-10px',
          borderWidth: '10px 0 10px 10px',
          borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',
        };
      case 7:
      case 9:
      case 10:
      default:
        return null;
    }
  }, [step, elementRect]);`;

tut = tut.replace(/const arrowStyle = useMemo\(\(\): React\.CSSProperties \| null => \{[\s\S]*?return null;\n\s*\}\n\s*\}, \[step, elementRect\]\);/, arrowStyleBlock);

fs.writeFileSync('src/components/TutorialModal.tsx', tut);
console.log('Fixed correctly!');
