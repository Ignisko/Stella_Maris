import React, { useState } from 'react';
import type { Apparition } from '../data/apparitions';
import { X, MapPin, CaretRight, MagnifyingGlass } from '@phosphor-icons/react';
import { getStatusColor, getApparitionStatusCategory } from '../utils/colors';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import FilterMenu from './FilterMenu';

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  apparitions: Apparition[];
  onSelectApparition: (app: Apparition) => void;
  lang: Language;
  activeFilters: string[];
  onChangeFilters: (filters: string[]) => void;
  activeCenturies: string[];
  onChangeCenturies: (centuries: string[]) => void;
}

const DirectoryModal: React.FC<DirectoryModalProps> = ({ 
  isOpen, 
  onClose, 
  apparitions, 
  onSelectApparition, 
  lang,
  activeFilters,
  onChangeFilters,
  activeCenturies,
  onChangeCenturies
}) => {
  const [localQuery, setLocalQuery] = useState('');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

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
      <div id="directory-modal-container" style={{
        width: '100%',
        maxWidth: '920px',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--glass-border)',
        background: 'var(--bg-color)',
        borderRadius: '24px',
        boxShadow: 'none'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '32px',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'transparent'
        }}>
          <div>
            <h2 style={{ 
              fontFamily: 'var(--font-sans)', 
              fontSize: '24px', 
              fontWeight: 600, 
              margin: 0, 
              color: 'var(--text-color)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px' 
            }}>
              <span>{t('directoryTitle', lang)}</span>
              <span style={{ 
                fontFamily: 'var(--font-sans)', 
                fontSize: '11px', 
                padding: '6px 12px', 
                border: '1px solid var(--glass-border)', 
                color: 'var(--text-color)', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRadius: '20px'
              }}>
                {t('directoryListed', lang, { count: filteredList.length })}
              </span>
            </h2>
            <p style={{ 
              fontSize: '12px', 
              opacity: 0.6, 
              margin: '8px 0 0 0', 
              color: 'var(--text-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {t('directorySubtitle', lang)}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: 'none',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-color)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderRadius: '50%'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
          >
            <X size={16} weight="regular" />
          </button>
        </div>

        {/* Local Search and Filters Row inside modal */}
        <div style={{ 
          padding: '24px 32px', 
          borderBottom: '1px solid var(--glass-border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '24px', 
          background: 'transparent',
          position: 'relative',
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, border: 'none', background: 'rgba(255, 255, 255, 0.08)', padding: '12px 16px', borderRadius: '24px' }}>
            <MagnifyingGlass size={16} weight="regular" style={{ opacity: 0.6 }} />
            <input
              type="text"
              placeholder={t('directoryQuickFilter', lang)}
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-color)',
                fontSize: '12px',
                width: '100%',
                outline: 'none',
                fontFamily: 'inherit',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            />
            {localQuery && (
              <button 
                onClick={() => setLocalQuery('')} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#f1f5f9', 
                  opacity: 0.6, 
                  cursor: 'pointer', 
                  fontSize: '13px',
                  whiteSpace: 'nowrap'
                }}
              >
                {t('directoryClear', lang)}
              </button>
            )}
          </div>
          
          <div style={{ width: '160px', flexShrink: 0 }}>
            <FilterMenu 
              activeFilters={activeFilters} 
              onChange={onChangeFilters} 
              activeCenturies={activeCenturies}
              onChangeCenturies={onChangeCenturies}
              lang={lang}
              isExpanded={isFiltersExpanded}
              onToggleExpanded={setIsFiltersExpanded}
              absolute={true}
            />
          </div>
        </div>

        {/* List Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '0',
          background: 'transparent'
        }}>
          {filteredList.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', opacity: 0.6, fontSize: '15px' }}>
              {t('directoryNoResults', lang)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                      padding: '16px 24px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: 'none',
                      borderRadius: '16px',
                      margin: '0 16px 8px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      gap: '16px'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = 'var(--text-color)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.color = 'var(--text-color)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        fontWeight: 600,
                        width: '48px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>{app.year}</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {app.title} {(app.approvalStatus === 'Dismissed' || app.approvalStatus === 'Unapproved apparitions') && '⚠️'}
                        </div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <MapPin size={12} weight="regular" />
                          <span>{app.location}, {app.country}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        background: `${color}15`,
                        border: `1px solid ${color}40`,
                        boxShadow: `0 0 10px ${color}30, inset 0 0 5px ${color}20`,
                        borderRadius: '20px'
                      }}>
                        <span style={{ width: '6px', height: '6px', backgroundColor: color, borderRadius: '50%' }} />
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: color, fontWeight: 600 }}>
                          {t(category as keyof typeof import('../utils/i18n').translations['en'], lang)}
                        </span>
                      </div>
                      <CaretRight size={16} weight="bold" />
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
