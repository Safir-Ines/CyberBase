import React from 'react';

export default function Tooltip({ children, text }) {
  if (!text) return children;
  return (
    <span className="tooltip-wrap">
      {children}
      <span className="tooltip-bubble">{text}</span>
    </span>
  );
}

export function InfoIcon({ tooltip }) {
  return (
    <Tooltip text={tooltip}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 16, height: 16, borderRadius: '50%',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        color: 'var(--text-secondary)', fontSize: 10, cursor: 'help', marginLeft: 6,
      }}>i</span>
    </Tooltip>
  );
}
