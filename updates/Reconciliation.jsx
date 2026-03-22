import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { getReconciliation, addReconciliation } from '../api';

const DEMO = [
  { reconciliation_id: 1, transaction_id: 101, match_status: 'MATCHED', remarks: 'All records match' },
  { reconciliation_id: 2, transaction_id: 102, match_status: 'UNMATCHED', remarks: 'Bank status FAILED, gateway shows SUCCESS' },
  { reconciliation_id: 3, transaction_id: 103, match_status: 'MATCHED', remarks: 'All records match' },
  { reconciliation_id: 4, transaction_id: 104, match_status: 'UNMATCHED', remarks: 'Amount mismatch in merchant record' },
  { reconciliation_id: 5, transaction_id: 105, match_status: 'MATCHED', remarks: 'All records match' },
  { reconciliation_id: 6, transaction_id: 106, match_status: 'UNMATCHED', remarks: 'Merchant record missing' },
];

const MATCH_OPTIONS = [
  { value: 'MATCHED', label: 'MATCHED' },
  { value: 'UNMATCHED', label: 'UNMATCHED' },
];

const EMPTY = { reconciliation_id: '', transaction_id: '', match_status: 'MATCHED', remarks: '' };

export default function Reconciliation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => {
    setLoading(true);
    getReconciliation().then(r => setData(r.data)).catch(() => setData(DEMO)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = filter === 'ALL' ? data : data.filter(r => r.match_status === filter);
  const matched = data.filter(r => r.match_status === 'MATCHED').length;
  const unmatched = data.filter(r => r.match_status === 'UNMATCHED').length;
  const matchRate = data.length ? ((matched / data.length) * 100).toFixed(1) : '—';

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      await addReconciliation(form);
      setMsg({ type: 'success', text: 'Reconciliation record added!' });
      setModalOpen(false); setForm(EMPTY); load();
    } catch { setMsg({ type: 'error', text: 'Failed. Check backend.' }); }
    finally { setSaving(false); setTimeout(() => setMsg(null), 3000); }
  };

  const COLS = [
    { key: 'reconciliation_id', label: 'Recon ID', render: v => <span style={{ color: 'var(--accent-purple)' }}>#{v}</span> },
    { key: 'transaction_id', label: 'Txn ID', render: v => <span style={{ color: 'var(--accent-cyan)' }}>#{v}</span> },
    { key: 'match_status', label: 'Match Status', render: v => <StatusBadge status={v} /> },
    { key: 'remarks', label: 'Remarks', render: v => <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{v}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Reconciliation"
        subtitle="Compare transaction records across bank, gateway and merchant"
        action={<button onClick={() => setModalOpen(true)} style={styles.addBtn}>+ Add Record</button>}
      />

      <div style={styles.grid3}>
        <StatCard label="Match Rate" value={`${matchRate}%`} icon="◈" color="var(--accent-cyan)" sub="Overall accuracy" />
        <StatCard label="Matched" value={matched} icon="✓" color="var(--accent-green)" sub="Records aligned" />
        <StatCard label="Unmatched" value={unmatched} icon="✗" color="var(--accent-red)" sub="Need investigation" />
      </div>

      {/* Progress bar */}
      {data.length > 0 && (
        <div style={styles.progressWrap}>
          <div style={styles.progressHeader}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Reconciliation Progress</span>
            <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>{matchRate}% matched</span>
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${matchRate}%` }} />
          </div>
        </div>
      )}

      {msg && (
        <div style={{ ...styles.msg, borderColor: msg.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)', color: msg.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {msg.text}
        </div>
      )}

      <div style={styles.filterRow}>
        {['ALL', 'MATCHED', 'UNMATCHED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ ...styles.tab, ...(filter === s ? styles.tabActive : {}) }}>{s}</button>
        ))}
      </div>

      {loading ? <div style={styles.loadText}>Loading records...</div> : <Table columns={COLS} data={filtered} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Reconciliation Record">
        <form onSubmit={handleSubmit}>
          <FormField label="Reconciliation ID" name="reconciliation_id" value={form.reconciliation_id} onChange={handleChange} required />
          <FormField label="Transaction ID" name="transaction_id" value={form.transaction_id} onChange={handleChange} required />
          <FormField label="Match Status" name="match_status" type="select" value={form.match_status} onChange={handleChange} options={MATCH_OPTIONS} />
          <FormField label="Remarks" name="remarks" value={form.remarks} onChange={handleChange} />
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" disabled={saving} style={styles.submitBtn}>{saving ? 'Saving...' : 'Save Record'}</button>
            <button type="button" onClick={() => setModalOpen(false)} style={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 },
  addBtn: { padding: '9px 18px', background: 'var(--accent-purple)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 13 },
  progressWrap: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 20 },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  progressTrack: { height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-green))', borderRadius: 3, transition: 'width 0.6s ease' },
  filterRow: { display: 'flex', gap: 6, marginBottom: 16 },
  tab: { padding: '7px 14px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' },
  tabActive: { background: 'rgba(168,85,247,0.1)', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' },
  msg: { padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid', background: 'var(--bg-card)', marginBottom: 16, fontSize: 13 },
  loadText: { color: 'var(--text-muted)', textAlign: 'center', padding: 48, fontStyle: 'italic' },
  submitBtn: { flex: 1, padding: '11px', background: 'var(--accent-purple)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 13 },
  cancelBtn: { padding: '11px 20px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', fontSize: 13 },
};
