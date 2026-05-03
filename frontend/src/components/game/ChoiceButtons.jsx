import React from 'react';

export default function ChoiceButtons({ choices, onSelect, disabled }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '16px',
    }}>
      {choices.map((choice, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(choice)}
          disabled={disabled}
          style={{
            padding: '14px 20px',
            background: '#ffffff',
            border: '2px solid #e5e8ed',
            borderRadius: '12px',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'left',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: disabled ? 0.6 : 1,
            outline: 'none',
          }}
          onMouseOver={e => {
            if (!disabled) {
              e.currentTarget.style.borderColor = '#22c55e';
              e.currentTarget.style.background = '#f0fdf4';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={e => {
            if (!disabled) {
              e.currentTarget.style.borderColor = '#e5e8ed';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}
