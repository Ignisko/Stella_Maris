import React, { useState, useMemo } from 'react';
import type { Apparition } from '../data/apparitions';
import { Search, X } from 'lucide-react';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface SearchBarProps {
  apparitions: Apparition[];
  onSelectApparition: (app: Apparition) => void;
  lang: Language;
}

const SearchBar: React.FC<SearchBarProps> = ({ apparitions, onSelectApparition, lang }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return apparitions.filter(app => 
      app.title.toLowerCase().includes(q) || 
      app.location.toLowerCase().includes(q) || 
      app.country.toLowerCase().includes(q) ||
      app.year.toString().includes(q)
    ).slice(0, 8); // Show top 8 matching results
  }, [query, apparitions]);

  return (
    <div style={{ position: 'relative', width: '100%', zIndex: 35 }}>
      <div className="glass-panel glass-panel-rounded" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '10px 16px', 
        gap: '10px', 
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid var(--glass-border)',
        pointerEvents: 'auto',
        height: '42px',
        borderRadius: '12px'
      }}>
        <Search size={16} color="var(--accent-color)" />
        <input
          type="text"
          placeholder={t('searchPlaceholder', lang)}
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: '#f1f5f9', 
            fontSize: '13px', 
            width: '100%', 
            outline: 'none', 
            fontFamily: 'inherit',
            fontWeight: 500
          }}
        />
        {query && (
          <button 
            onClick={() => setQuery('')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#f1f5f9', 
              cursor: 'pointer', 
              opacity: 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="glass-panel glass-panel-rounded animate-fade-in" style={{ 
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px', 
          maxHeight: '280px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '6px 0', 
          background: 'rgba(15, 23, 42, 0.98)',
          pointerEvents: 'auto',
          border: '1px solid var(--glass-border)',
          zIndex: 50,
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
        }}>
          {filtered.map(app => (
            <div
              key={app.id}
              onClick={() => {
                onSelectApparition(app);
                setQuery('');
              }}
              style={{ 
                padding: '10px 16px', 
                cursor: 'pointer', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '2px', 
                transition: 'background 0.2s' 
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold-accent)' }}>
                {app.title}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.8, color: 'var(--text-color)' }}>
                {app.location}, {app.country} ({app.year})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
