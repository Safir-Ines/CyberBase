import React from 'react';

export default function InfoBox({ title, children, icon = '✦', color = 'var(--accent-cyan)' }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderLeft: `3px solid ${color}`,
      borderRadius: '20px',
      padding: '24px',
      fontSize: '14px',
      color: 'rgba(148, 163, 184, 0.7)',
      lineHeight: 1.7,
    }}>
      {title && (
        <div style={{ 
          fontWeight: 800, 
          color, 
          textTransform: 'uppercase', 
          fontSize: '11px', 
          letterSpacing: '0.15em', 
          marginBottom: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          <span style={{ fontSize: '16px', opacity: 0.8 }}>{icon}</span> {title}
        </div>
      )}
      <div style={{ color: 'rgba(148, 163, 184, 0.8)' }}>
        {children}
      </div>
    </div>
  );
}
