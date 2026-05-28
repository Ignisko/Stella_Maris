const fs = require('fs');
let content = fs.readFileSync('src/components/TutorialModal.tsx', 'utf8');

const targetStr = `<button
              onClick={handleNext}
              style={{
                background: 'linear-gradient(135deg, var(--accent-color), rgba(59, 130, 246, 0.85))',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                borderRadius: '20px',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(56, 189, 248, 0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.25)';
              }}
            >
              <span>{step === 0 ? tLocal.start : step === steps.length - 1 ? tLocal.finish : tLocal.next}</span>
              {step < steps.length - 1 && <ArrowRight size={14} />}
            </button>`;

const replacementStr = `{step !== 4 && (
            <button
              onClick={handleNext}
              style={{
                background: 'linear-gradient(135deg, var(--accent-color), rgba(59, 130, 246, 0.85))',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                borderRadius: '20px',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(56, 189, 248, 0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.25)';
              }}
            >
              <span>{step === 0 ? tLocal.start : step === steps.length - 1 ? tLocal.finish : tLocal.next}</span>
              {step < steps.length - 1 && <ArrowRight size={14} />}
            </button>
            )}`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/TutorialModal.tsx', content);
