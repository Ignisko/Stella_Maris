const fs = require('fs');
const file = 'c:/Users/ignac/Documents/github projects/stellamaris.help/src/components/TutorialModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
        if (step === 4) selector = '#search-filters-container';
      else if (step === 5) selector = '#filter-tabs-content-container';
      else if (step === 6) selector = '#browse-directory-button';
      else if (step === 7) selector = '#directory-modal-container';
      else if (step === 8) selector = '#timeline-closed-pill';
      else if (step === 9) selector = '#timeline-play-presentation-button';
      else if (step === 10) selector = '#auto-rotate-button';,
        if (step === 2) selector = '#auto-rotate-button';
      else if (step === 5) selector = '#search-filters-container';
      else if (step === 6) selector = '#filter-tabs-content-container';
      else if (step === 7) selector = '#browse-directory-button';
      else if (step === 8) selector = '#directory-modal-container';
      else if (step === 9) selector = '#timeline-closed-pill';
      else if (step === 10) selector = '#timeline-play-presentation-button';
);

content = content.replace(
  if (step === 1 || step === 2 || step === 3) {,
  if (step === 1 || step === 3 || step === 4) {
);

content = content.replace(
        if (step === 4) {
        paddingT = 2; // reduces the excessive top space to center the frame
        paddingB = 10; // shifts the highlight down slightly to center it evenly
      },
        if (step === 5) {
        paddingT = 2; // reduces the excessive top space to center the frame
        paddingB = 10; // shifts the highlight down slightly to center it evenly
      }
);

content = content.replace(
      if (step === 1 || step === 2 || step === 3) {
      return {
        ...common,
        left: '60px',
        top: '150px',
      };
    },
      if (step === 1 || step === 3 || step === 4) {
      return {
        ...common,
        left: '60px',
        top: '150px',
      };
    }
);

content = content.replace(
        switch (step) {
        case 4:
        case 5:
        case 6:
          return {
            ...common,
            left: \\px\,
            top: \\px\,
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
            left: \\px\,
            bottom: '30px',
          };
        case 9:
          return {
            ...common,
            left: '50px',
            bottom: \\px\,
            width: '420px',
          };
        case 10:
          return {
            ...common,
            left: \\px\,
            bottom: '30px',
          };
      },
        switch (step) {
        case 5:
        case 6:
        case 7:
          return {
            ...common,
            left: \\px\,
            top: \\px\,
          };
        case 8:
          return {
            ...common,
            left: '50px',
            bottom: '30px',
            width: '420px',
          };
        case 9:
          return {
            ...common,
            left: \\px\,
            bottom: '30px',
          };
        case 10:
          return {
            ...common,
            left: '50px',
            bottom: \\px\,
            width: '420px',
          };
        case 2:
          return {
            ...common,
            left: \\px\,
            bottom: '30px',
          };
      }
);

content = content.replace(
      if (step === 0 || step === 1 || step === 2 || step === 3 || step === 11 || !elementRect) return null;,
      if (step === 0 || step === 1 || step === 3 || step === 4 || step === 11 || !elementRect) return null;
);

content = content.replace(
      switch (step) {
      case 4:
      case 5:
      case 6:
      case 10:
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
      case 9:
        return {
          ...base,
          bottom: '-10px',
          left: '40px',
          borderWidth: '10px 10px 0 10px',
          borderColor: 'rgba(15, 23, 42, 0.96) transparent transparent transparent',
        };
      case 7:,
      switch (step) {
      case 5:
      case 6:
      case 7:
      case 2:
        return {
          ...base,
          top: '30px',
          left: '-10px',
          borderWidth: '10px 10px 10px 0',
          borderColor: 'transparent rgba(15, 23, 42, 0.96) transparent transparent',
        };
      case 9:
        return {
          ...base,
          bottom: '24px',
          right: '-10px',
          borderWidth: '10px 0 10px 10px',
          borderColor: 'transparent transparent transparent rgba(15, 23, 42, 0.96)',
        };
      case 10:
        return {
          ...base,
          bottom: '-10px',
          left: '40px',
          borderWidth: '10px 10px 0 10px',
          borderColor: 'rgba(15, 23, 42, 0.96) transparent transparent transparent',
        };
      case 8:
);

fs.writeFileSync(file, content);
console.log('Layout updated');
