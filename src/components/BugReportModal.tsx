import React, { useState } from 'react';
import { Bug, X } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface BugReportModalProps {
  onClose: () => void;
  lang: Language;
}

const BugReportModal: React.FC<BugReportModalProps> = ({ onClose, lang }) => {
  const [category, setCategory] = useState('UI Bug');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Stella Maris Feedback (${lang}): ${category}`);
    const body = encodeURIComponent(description);
    
    // Obfuscate email to prevent basic scrapers from harvesting it
    const user = 'StellaMarisvox';
    const domain = 'proton.me';
    window.location.href = `mailto:${user}@${domain}?subject=${subject}&body=${body}`;
    
    onClose();
  };

  return (
    <div 
      className="modal-overlay animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div 
        className="glass-panel glass-panel-rounded"
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '500px',
          padding: '30px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8)'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-color)',
            cursor: 'pointer',
            opacity: 0.7,
            padding: '4px',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '1'}
          onMouseOut={e => e.currentTarget.style.opacity = '0.7'}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: 'var(--accent-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
          }}>
            <Bug size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#fff' }}>Submit feedback</h2>
            <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              Help us improve Stella Maris by reporting issues or sharing your ideas!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500 }}>Category</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
                padding: '14px',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              <option value="Information/Data Error">Incorrect information or data error</option>
              <option value="UI Bug">Visual or UI bug</option>
              <option value="Suggestion">Feature suggestion</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500 }}>Description</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={6}
              placeholder="Please describe the issue or suggestion in detail..."
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
                padding: '14px',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '15px',
                resize: 'vertical',
                lineHeight: '1.5'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              background: 'linear-gradient(135deg, var(--accent-color), #2563eb)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '12px',
              transition: 'all 0.2s',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            Send report via email
          </button>
        </form>
      </div>
    </div>
  );
};

export default BugReportModal;
