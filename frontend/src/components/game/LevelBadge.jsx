import React from 'react';

const LEVEL_CONFIG = {
  1: { label: 'Novice', color: '#94a3b8', bg: '#f1f5f9', icon: '🌱' },
  2: { label: 'Aware Employee', color: '#22c55e', bg: '#f0fdf4', icon: '🛡️' },
  3: { label: 'Security Expert', color: '#3b82f6', bg: '#eff6ff', icon: '🥷' },
  4: { label: 'Elite Guardian', color: '#f59e0b', bg: '#fffbeb', icon: '👑' },
};

export default function LevelBadge({ level }) {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      background: config.bg,
      border: `1px solid ${config.color}33`,
      borderRadius: '20px',
      color: config.color,
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    }}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
}
