import React from 'react';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

const styles = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 28,
  },
  title: {
    fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
    color: 'var(--text-primary)', lineHeight: 1.1,
  },
  subtitle: {
    marginTop: 4, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400,
  },
};
