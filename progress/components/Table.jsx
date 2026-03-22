import React from 'react';

export default function Table({ columns, data, emptyMessage = 'No data found' }) {
  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ ...styles.th, width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={styles.empty}>{emptyMessage}</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} style={styles.tr}>
                {columns.map(col => (
                  <td key={col.key} style={styles.td}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrapper: { overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.1s' },
  td: {
    padding: '13px 16px',
    fontSize: 13,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    background: 'var(--bg-card)',
    whiteSpace: 'nowrap',
  },
  empty: {
    padding: '48px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    background: 'var(--bg-card)',
    fontStyle: 'italic',
  },
};
