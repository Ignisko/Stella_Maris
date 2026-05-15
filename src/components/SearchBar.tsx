import React, { useState, useMemo } from 'react';
import type { Apparition } from '../data/apparitions';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  apparitions: Apparition[];
  onSelectApparition: (app: Apparition) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ apparitions, onSelectApparition }) => {
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
    <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 30, width: '320px' }}>
      <div className="glass-panel glass-panel-rounded" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '12px 18px', 
        gap: '12px', 
        background: 'rgba(15, 23, 42, 0.8)',
        pointerEvents: 'auto'
      }}>
        <Search size={18} color="var(--accent-color)" />
        <input
          type="text"
          placeholder="Search shrine, country, year..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: '#f1f5f9', 
            fontSize: '14px', 
            width: '100%', 
            outline: 'none', 
            fontFamily: 'var(--font-family)',
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
            <X size={16} />
          </button>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="glass-panel glass-panel-rounded animate-fade-in" style={{ 
          marginTop: '8px', 
          maxHeight: '340px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '8px 0', 
          background: 'rgba(15, 23, 42, 0.95)',
          pointerEvents: 'auto',
          border: '1px solid var(--glass-border)'
        }}>
          {filtered.map(app => (
            <div
              key={app.id}
              onClick={() => {
                onSelectApparition(app);
                setQuery('');
              }}
              style={{ 
                padding: '12px 18px', 
                cursor: 'pointer', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '4px', 
                transition: 'background 0.2s' 
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gold-accent)' }}>
                {app.title}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8, color: 'var(--text-color)' }}>
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
