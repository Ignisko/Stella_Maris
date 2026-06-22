import React from 'react';
import { X } from '@phosphor-icons/react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '600px',
          maxHeight: '85vh',
          backgroundColor: 'var(--panel-bg, rgba(20, 20, 25, 0.85))',
          borderRadius: '16px',
          padding: '24px',
          color: 'var(--text-color, #ffffff)',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-color, #ffffff)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7,
            transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          <X size={24} weight="bold" />
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', paddingRight: '32px' }}>
          What the Virgin Mary asked for
        </h2>

        <p style={{ marginBottom: '16px', lineHeight: '1.6', opacity: 0.9 }}>
          Across various approved visitations (such as Our Lady of Guadalupe, Lourdes, and Fátima), Mary has requested:
        </p>

        <ul style={{ paddingLeft: '24px', marginBottom: '24px', lineHeight: '1.6', opacity: 0.9, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li>
            <strong style={{ color: 'var(--accent-color, #38bdf8)' }}>daily prayer:</strong> she continually asks people to pray the Rosary every day for world peace and an end to wars.
          </li>
          <li>
            <strong style={{ color: 'var(--accent-color, #38bdf8)' }}>acts of penance and sacrifice:</strong> she asks the faithful to offer up small sacrifices and perform penance to make up for the sins of the world.
          </li>
          <li>
            <strong style={{ color: 'var(--accent-color, #38bdf8)' }}>building a Church or chapel:</strong> in multiple visitations (like at Guadalupe and Beauraing), she asked that a chapel be built at the site as a place of prayer, healing, and pilgrimage.
          </li>
          <li>
            <strong style={{ color: 'var(--accent-color, #38bdf8)' }}>repentance:</strong> she repeatedly warns humanity of the consequences of moral decay and begs for repentance and the conversion of sinners.
          </li>
          <li>
            <strong style={{ color: 'var(--accent-color, #38bdf8)' }}>devotion to her Immaculate Heart:</strong> in apparitions like Fátima, she asked for the consecration of the world (and specifically Russia) to her Immaculate Heart.
          </li>
        </ul>

        <p style={{ lineHeight: '1.6', opacity: 0.9, fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
          The underlying goal of all these requests is fundamentally the same: to lead the faithful closer to Jesus Christ. In Catholic tradition, Marian apparitions are private revelations meant to draw attention to the Gospel and serve as expressions of divine care during difficult times in history.
        </p>
      </div>
    </div>
  );
};

export default MessageModal;
