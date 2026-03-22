import React from 'react';

const STATUS_CONFIG = {
  SUCCESS:    { color: 'var(--success)',    bg: 'rgba(0,255,136,0.1)' },
  FAILED:     { color: 'var(--failed)',     bg: 'rgba(255,71,87,0.1)' },
  PENDING:    { color: 'var(--pending)',    bg: 'rgba(255,184,48,0.1)' },
  PROCESSING: { color: 'var(--processing)', bg: 'rgba(168,85,247,0.1)' },
  MATCHED:    { color: 'var(--success)',    bg: 'rgba(0,255,136,0.1)' },
  UNMATCHED:  { color: 'var(--failed)',     bg: 'rgba(255,71,87,0.1)' },
  OPEN:       { color: 'var(--accent-cyan)', bg: 'rgba(0,212,255,0.1)' },
  RESOLVED:   { color: 'var(--success)',    bg: 'rgba(0,255,136,0.1)' },
  ESCALATED:  { color: 'var(--accent-amber)', bg: 'rgba(255,184,48,0.1)' },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toUpperCase()] || { color: 'var(--text-muted)', bg: 'var(--border)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
      color: cfg.color, background: cfg.bg,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {status?.toUpperCase()}
    </span>
  );
}
