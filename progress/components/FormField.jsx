import React from 'react';

export default function FormField({ label, name, type = 'text', value, onChange, options, required }) {
  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    fontSize: 13, fontFamily: 'var(--font-mono)',
    outline: 'none', transition: 'border-color 0.15s',
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
        {label}{required && <span style={{ color: 'var(--accent-red)', marginLeft: 3 }}>*</span>}
      </label>
      {type === 'select' ? (
        <select name={name} value={value} onChange={onChange} required={required} style={inputStyle}>
          <option value="">Select...</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type} name={name} value={value} onChange={onChange}
          required={required} style={inputStyle}
        />
      )}
    </div>
  );
}
