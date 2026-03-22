import React from 'react';

export default function StatCard({ label, value, sub, color = 'var(--accent-cyan)', icon }) {
  return (
    <div style={{ ...styles.card, '--accent': color }}>
      <div style={styles.top}>
        <span style={{ ...styles.icon, color }}>{icon}</span>
        <span style={styles.label}>{label}</span>
      </div>
      <div style={{ ...styles.value, color }}>{value ?? '—'}</div>
      {sub && <div style={styles.sub}>{sub}</div>}
      <div style={{ ...styles.bar, background: color }} />
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '20px 22px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  top: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  icon: { fontSize: 18 },
  label: { fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase' },
  value: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, lineHeight: 1 },
  sub: { fontSize: 12, color: 'var(--text-muted)', marginTop: 6 },
  bar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, opacity: 0.5 },
};
