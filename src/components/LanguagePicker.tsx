import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { languageNames } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface LanguagePickerProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const LANGUAGE_FLAGS: Record<Language, string> = {
  en: '🇬🇧',
  pl: '🇵🇱',
  es: '🇪🇸',
  pt: '🇵🇹',
  fr: '🇫🇷',
  it: '🇮🇹',
  ar: '🇸🇦',
  tl: '🇵🇭',
  vi: '🇻🇳'
};


const LanguagePicker: React.FC<LanguagePickerProps> = ({ currentLang, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '20px', 
        zIndex: 100, 
        pointerEvents: 'auto' 
      }}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel glass-panel-rounded"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: isOpen ? 'rgba(56,189,248,0.15)' : 'rgba(15, 23, 42, 0.8)',
          border: `1px solid ${isOpen ? 'rgba(56,189,248,0.5)' : 'var(--glass-border)'}`,
          color: 'var(--text-color)',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          transition: 'all 0.2s ease',
          height: '42px',
          borderRadius: '12px',
          outline: 'none'
        }}
        onMouseOver={e => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
            e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)';
          }
        }}
        onMouseOut={e => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
          }
        }}
      >
        <span style={{ fontSize: '18px' }}>{LANGUAGE_FLAGS[currentLang]}</span>
        <ChevronDown 
          size={13} 
          style={{ 
            opacity: 0.7, 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="glass-panel glass-panel-rounded animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '180px',
            background: 'rgba(15, 23, 42, 0.96)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            padding: '6px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            zIndex: 101
          }}
        >
          {(Object.keys(LANGUAGE_FLAGS) as Language[]).map(lang => {
            const isSelected = currentLang === lang;
            return (
              <button
                key={lang}
                onClick={() => handleSelect(lang)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  border: 'none',
                  color: isSelected ? 'var(--gold-accent)' : 'var(--text-color)',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.15s ease',
                  opacity: isSelected ? 1 : 0.85
                }}
                onMouseOver={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.opacity = '1';
                  }
                }}
                onMouseOut={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.opacity = '0.85';
                  }
                }}
              >
                <span style={{ fontSize: '16px', width: '20px', display: 'inline-block' }}>{LANGUAGE_FLAGS[lang]}</span>
                <span style={{ flex: 1 }}>{languageNames[lang]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguagePicker;
