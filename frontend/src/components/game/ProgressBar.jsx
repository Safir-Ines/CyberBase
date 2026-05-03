import React from 'react';

export default function ProgressBar({ current, total, label }) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div style={{ width: '100%', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>{Math.round(percentage)}%</span>
      </div>
      <div style={{ height: '8px', background: '#e5e8ed', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: 'linear-gradient(90deg, #22c55e, #10b981)',
          borderRadius: '4px',
          transition: 'width 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
        }} />
      </div>
    </div>
  );
}
