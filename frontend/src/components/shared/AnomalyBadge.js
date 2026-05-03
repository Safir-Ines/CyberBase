import React from 'react';
import Tooltip from './Tooltip';

export default function AnomalyBadge({ score, reasons = [], compact = false }) {
  const flagged = score > 60;
  const color = flagged ? 'var(--accent-red)' : score > 40 ? 'var(--accent-orange)' : 'var(--accent-green)';
  const bg = flagged ? 'var(--accent-red-dim)' : score > 40 ? 'var(--accent-orange-dim)' : 'var(--accent-green-dim)';
  const border = flagged ? 'rgba(255,51,102,0.2)' : score > 40 ? 'rgba(255,107,53,0.2)' : 'rgba(0,255,148,0.2)';

  const tip = reasons && reasons.length
    ? `Anomaly score ${score}/100\n\n${reasons.map(r => '• ' + r).join('\n')}`
    : `Anomaly score ${score}/100`;

  return (
    <Tooltip text={tip}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: compact ? '2px 6px' : '3px 10px', borderRadius: 100,
        background: bg, color, border: `1px solid ${border}`,
        fontFamily: 'var(--font-mono)', fontSize: compact ? 10 : 11, fontWeight: 600,
        cursor: 'help',
      }}>
        {flagged ? '⚠' : '●'} {score}
      </span>
    </Tooltip>
  );
}
