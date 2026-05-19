import React, { useState } from 'react';
import type { Apparition } from '../data/apparitions';
import { X, MapPin, Calendar, ChevronRight, Search } from 'lucide-react';
import { getStatusColor, getApparitionStatusCategory } from '../utils/colors';

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  apparitions: Apparition[];
  onSelectApparition: (app: Apparition) => void;
}

const DirectoryModal: React.FC<DirectoryModalProps> = ({ isOpen, onClose, apparitions, onSelectApparition }) => {
  const [localQuery, setLocalQuery] = useState('');

  if (!isOpen) return null;

  const filteredList = apparitions.filter(app => {
    if (!localQuery.trim()) return true;
    const q = localQuery.toLowerCase();
    return app.title.toLowerCase().includes(q) ||
           app.location.toLowerCase().includes(q) ||
           app.country.toLowerCase().includes(q) ||
           app.year.toString().includes(q) ||
           app.approvalStatus.toLowerCase().includes(q);
  }).sort((a, b) => a.year - b.year);

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(5, 10, 24, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel glass-panel-rounded" style={{
        width: '100%',
        maxWidth: '920px',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        background: 'rgba(15, 23, 42, 0.9)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>Marian apparitions directory</span>
              <span style={{ fontSize: '13px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-color)', fontWeight: 500 }}>
                {filteredList.length} listed
              </span>
            </h2>
            <p style={{ fontSize: '13px', opacity: 0.7, margin: '4px 0 0 0', color: 'var(--text-color)' }}>
              Complete chronological overview of filtered shrines and apparitions
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--glass-border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f1f5f9',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Local Search inside modal */}
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)' }}>
          <Search size={16} color="var(--accent-color)" />
          <input
            type="text"
            placeholder="Quick filter by title, city, country, year, or status..."
            value={localQuery}
            onChange={e => setLocalQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f1f5f9',
              fontSize: '14px',
              width: '100%',
              outline: 'none',
              fontFamily: 'inherit',
              fontWeight: 500
            }}
          />
          {localQuery && (
            <button onClick={() => setLocalQuery('')} style={{ background: 'none', border: 'none', color: '#f1f5f9', opacity: 0.6, cursor: 'pointer', fontSize: '13px' }}>
              Clear
            </button>
          )}
        </div>

        {/* List Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
          {filteredList.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', opacity: 0.6, fontSize: '15px' }}>
              No apparitions match your current search criteria.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredList.map(app => {
                const color = getStatusColor(app.approvalStatus);
                const category = getApparitionStatusCategory(app.approvalStatus);
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      onSelectApparition(app);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      gap: '16px'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = color;
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: 'var(--gold-accent)',
                        width: '56px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Calendar size={14} opacity={0.6} />
                        <span>{app.year}</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {app.title}
                        </div>
                        <div style={{ fontSize: '13px', opacity: 0.7, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <MapPin size={12} />
                          <span>{app.location}, {app.country}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: 'rgba(0,0,0,0.3)',
                        border: `1px solid ${color}40`,
                      }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>
                          {category === "Approved for faith expression" ? "Faith expression" : category}
                        </span>
                      </div>
                      <ChevronRight size={16} opacity={0.5} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectoryModal;
