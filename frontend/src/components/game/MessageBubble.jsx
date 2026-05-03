import React from 'react';

export default function MessageBubble({ message }) {
  const isBot = message.type === 'bot';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isBot ? 'flex-start' : 'flex-end',
      width: '100%',
      animation: 'slideIn 0.3s ease-out forwards',
    }}>
      <div style={{
        maxWidth: '85%',
        padding: '14px 18px',
        borderRadius: isBot ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
        background: isBot ? 'var(--bg-elevated)' : 'var(--accent)',
        color: isBot ? 'var(--text-primary)' : '#ffffff',
        fontSize: '14.5px',
        lineHeight: '1.6',
        boxShadow: 'var(--shadow-sm)',
        border: isBot ? '1px solid var(--border)' : 'none',
      }}>
        {message.text}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
