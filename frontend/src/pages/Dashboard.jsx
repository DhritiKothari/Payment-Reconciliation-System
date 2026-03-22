import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PageHeader from '../components/PageHeader';
import { getTransactions, getDisputes, getReconciliationSummary } from '../api';

const PIE_COLORS = ['#00ff88', '#ff4757', '#ffb830', '#a855f7'];

export default function Dashboard() {
  const [txns, setTxns] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [recon, setRecon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTransactions(), getDisputes(), getReconciliationSummary()])
      .then(([t, d, r]) => {
        setTxns(t.data);
        setDisputes(d.data);
        setRecon(r.data);
      })
      .catch(() => {
        // Demo data when backend not connected
        setTxns([
          { transaction_id: 101, customer_id: 1, amount: 2500.00, status: 'SUCCESS', date_time: '2025-01-10T10:30:00' },
          { transaction_id: 102, customer_id: 2, amount: 120.00, status: 'FAILED', date_time: '2025-01-11T11:15:00' },
          { transaction_id: 103, customer_id: 3, amount: 5000.00, status: 'SUCCESS', date_time: '2025-01-12T14:45:00' },
          { transaction_id: 104, customer_id: 4, amount: 800.00, status: 'PENDING', date_time: '2025-01-13T09:20:00' },
          { transaction_id: 105, customer_id: 5, amount: 7500.00, status: 'SUCCESS', date_time: '2025-01-14T16:00:00' },
          { transaction_id: 106, customer_id: 1, amount: 60.00, status: 'FAILED', date_time: '2025-01-15T18:30:00' },
        ]);
        setDisputes([
          { dispute_id: 1, transaction_id: 102, issue_type: 'Payment Failed', dispute_status: 'OPEN' },
          { dispute_id: 2, transaction_id: 104, issue_type: 'Status Mismatch', dispute_status: 'ESCALATED' },
          { dispute_id: 3, transaction_id: 106, issue_type: 'Incorrect Debit', dispute_status: 'RESOLVED' },
        ]);
        setRecon([{ match_status: 'MATCHED', total: 4 }, { match_status: 'UNMATCHED', total: 2 }]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Computed stats
  const total = txns.length;
  const totalAmount = txns.reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  const successCount = txns.filter(t => t.status === 'SUCCESS').length;
  const failedCount = txns.filter(t => t.status === 'FAILED').length;
  const openDisputes = disputes.filter(d => d.dispute_status === 'OPEN').length;

  // Bar chart data
  const statusGroups = ['SUCCESS', 'FAILED', 'PENDING', 'PROCESSING'].map(s => ({
    name: s,
    count: txns.filter(t => t.status === s).length,
  }));

  // Pie chart data
  const reconPie = recon.map((r, i) => ({ name: r.match_status, value: Number(r.total) }));

  const recentTxns = [...txns].sort((a, b) => new Date(b.date_time) - new Date(a.date_time)).slice(0, 5);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Live overview · ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {/* Stat Cards */}
      <div style={styles.grid4}>
        <StatCard label="Total Transactions" value={total} sub="All time" icon="⟳" color="var(--accent-cyan)" />
        <StatCard label="Total Volume" value={`₹${totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} sub="Sum of all amounts" icon="◈" color="var(--accent-green)" />
        <StatCard label="Success Rate" value={total ? `${((successCount / total) * 100).toFixed(1)}%` : '—'} sub={`${successCount} successful`} icon="✓" color="var(--accent-green)" />
        <StatCard label="Open Disputes" value={openDisputes} sub="Needs attention" icon="⚠" color="var(--accent-red)" />
      </div>

      {/* Charts Row */}
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Transaction Status Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusGroups} barSize={32}>
              <XAxis dataKey="name" tick={{ fill: '#6b8cba', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b8cba', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: 8, color: '#e8f0fe' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusGroups.map((entry, i) => (
                  <Cell key={i} fill={['#00ff88', '#ff4757', '#ffb830', '#a855f7'][i] || '#00d4ff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Reconciliation Summary</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, height: 200 }}>
            <PieChart width={160} height={160}>
              <Pie data={reconPie.length ? reconPie : [{ name: 'No Data', value: 1 }]}
                cx={75} cy={75} innerRadius={48} outerRadius={72} dataKey="value" paddingAngle={3}>
                {reconPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
            </PieChart>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reconPie.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginLeft: 4 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>Recent Transactions</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Txn ID', 'Customer', 'Amount', 'Date', 'Status'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTxns.map((t, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={styles.td}><span style={{ color: 'var(--accent-cyan)' }}>#{t.transaction_id}</span></td>
                <td style={styles.td}>CUST-{t.customer_id}</td>
                <td style={styles.td}>₹{parseFloat(t.amount).toLocaleString('en-IN')}</td>
                <td style={styles.td}>{new Date(t.date_time).toLocaleDateString('en-IN')}</td>
                <td style={styles.td}><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Loading data...</div>
  </div>
);

const styles = {
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  card: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px', marginBottom: 0 },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', marginBottom: 16, textTransform: 'uppercase' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' },
  td: { padding: '12px 14px', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' },
};
