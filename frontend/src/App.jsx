import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Disputes from './pages/Disputes';
import Reconciliation from './pages/Reconciliation';
import './index.css';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '◈' },
  { path: '/transactions', label: 'Transactions', icon: '⟳' },
  { path: '/reconciliation', label: 'Reconciliation', icon: '⊕' },
  { path: '/disputes', label: 'Disputes', icon: '⚠' },
];

export default function App() {
  return (
    <Router>
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>◈</span>
            <div>
              <div style={styles.logoText}>PayRec</div>
              <div style={styles.logoSub}>Reconciliation System</div>
            </div>
          </div>
          <nav style={styles.nav}>
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                style={({ isActive }) => ({
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                })}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div style={styles.sidebarFooter}>
            <div style={styles.statusDot} />
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>MySQL Connected</span>
          </div>
        </aside>
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reconciliation" element={<Reconciliation />} />
            <Route path="/disputes" element={<Disputes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 20px 28px',
    borderBottom: '1px solid var(--border)',
    marginBottom: 16,
  },
  logoIcon: { fontSize: 28, color: 'var(--accent-cyan)' },
  logoText: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' },
  logoSub: { fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px', flex: 1 },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.15s ease',
    letterSpacing: '0.02em',
  },
  navItemActive: {
    background: 'rgba(0, 212, 255, 0.08)',
    color: 'var(--accent-cyan)',
    borderLeft: '2px solid var(--accent-cyan)',
  },
  navIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  sidebarFooter: {
    padding: '16px 20px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--accent-green)',
    boxShadow: '0 0 6px var(--accent-green)',
  },
  main: { flex: 1, padding: '32px', overflowY: 'auto', background: 'var(--bg-primary)' },
};
