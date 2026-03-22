import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { getDisputes, addDispute, updateDisputeStatus, deleteDispute } from '../api';

const DEMO = [
  { dispute_id: 1, transaction_id: 102, issue_type: 'Payment Failed', dispute_status: 'OPEN' },
  { dispute_id: 2, transaction_id: 104, issue_type: 'Status Mismatch', dispute_status: 'ESCALATED' },
  { dispute_id: 3, transaction_id: 106, issue_type: 'Incorrect Debit', dispute_status: 'RESOLVED' },
  { dispute_id: 4, transaction_id: 103, issue_type: 'Duplicate Charge', dispute_status: 'OPEN' },
];

const ISSUE_OPTIONS = [
  { value: 'Payment Failed', label: 'Payment Failed' },
  { value: 'Status Mismatch', label: 'Status Mismatch' },
  { value: 'Incorrect Debit', label: 'Incorrect Debit' },
  { value: 'Duplicate Charge', label: 'Duplicate Charge' },
  { value: 'Delayed Settlement', label: 'Delayed Settlement' },
];

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'OPEN' },
  { value: 'ESCALATED', label: 'ESCALATED' },
  { value: 'RESOLVED', label: 'RESOLVED' },
];

const EMPTY = { dispute_id: '', transaction_id: '', issue_type: '', dispute_status: 'OPEN' };

export default function Disputes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const load = () => {
    setLoading(true);
    getDisputes().then(r => setData(r.data)).catch(() => setData(DEMO)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = filterStatus === 'ALL' ? data : data.filter(d => d.dispute_status === filterStatus);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDispute(form);
      setMsg({ type: 'success', text: 'Dispute created successfully!' });
      setModalOpen(false); setForm(EMPTY); load();
    } catch { setMsg({ type: 'error', text: 'Failed. Check backend.' }); }
    finally { setSaving(false); setTimeout(() => setMsg(null), 3000); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateDisputeStatus(id, status);
      setData(d => d.map(item => item.dispute_id === id ? { ...item, dispute_status: status } : item));
      setMsg({ type: 'success', text: `Dispute #${id} updated to ${status}` });
    } catch { setMsg({ type: 'error', text: 'Update failed.' }); }
    setTimeout(() => setMsg(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete dispute #${id}?`)) return;
    try {
      await deleteDispute(id);
      setData(d => d.filter(item => item.dispute_id !== id));
    } catch { setMsg({ type: 'error', text: 'Delete failed.' }); }
  };

  const COLS = [
    { key: 'dispute_id', label: 'Dispute ID', render: v => <span style={{ color: 'var(--accent-red)' }}>#{v}</span> },
    { key: 'transaction_id', label: 'Txn Ref', render: v => <span style={{ color: 'var(--accent-cyan)' }}>#{v}</span> },
    { key: 'issue_type', label: 'Issue Type', render: v => <span style={{ color: 'var(--accent-amber)' }}>{v}</span> },
    { key: 'dispute_status', label: 'Status', render: v => <StatusBadge status={v} /> },
    {
      key: 'dispute_id', label: 'Update Status', render: (v, row) => (
        <select
          value={row.dispute_status}
          onChange={e => handleStatusChange(v, e.target.value)}
          style={styles.selectInline}
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
    },
    {
      key: 'dispute_id', label: 'Actions', render: (v) => (
        <button onClick={() => handleDelete(v)} style={styles.deleteBtn}>Remove</button>
      )
    },
  ];

  const open = data.filter(d => d.dispute_status === 'OPEN').length;
  const escalated = data.filter(d => d.dispute_status === 'ESCALATED').length;
  const resolved = data.filter(d => d.dispute_status === 'RESOLVED').length;

  return (
    <div>
      <PageHeader
        title="Dispute Management"
        subtitle="Track and resolve transaction disputes"
        action={<button onClick={() => setModalOpen(true)} style={styles.addBtn}>+ Raise Dispute</button>}
      />

      <div style={styles.grid3}>
        <StatCard label="Open" value={open} icon="⚠" color="var(--accent-cyan)" sub="Requires action" />
        <StatCard label="Escalated" value={escalated} icon="↑" color="var(--accent-amber)" sub="High priority" />
        <StatCard label="Resolved" value={resolved} icon="✓" color="var(--accent-green)" sub="Closed" />
      </div>

      {msg && (
        <div style={{ ...styles.msg, borderColor: msg.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)', color: msg.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {msg.text}
        </div>
      )}

      <div style={styles.filterRow}>
        {['ALL', 'OPEN', 'ESCALATED', 'RESOLVED'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ ...styles.tab, ...(filterStatus === s ? styles.tabActive : {}) }}>{s}</button>
        ))}
      </div>

      {loading ? <div style={styles.loadText}>Loading disputes...</div> : <Table columns={COLS} data={filtered} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Raise New Dispute">
        <form onSubmit={handleSubmit}>
          <FormField label="Dispute ID" name="dispute_id" value={form.dispute_id} onChange={handleChange} required />
          <FormField label="Transaction ID" name="transaction_id" value={form.transaction_id} onChange={handleChange} required />
          <FormField label="Issue Type" name="issue_type" type="select" value={form.issue_type} onChange={handleChange} options={ISSUE_OPTIONS} required />
          <FormField label="Status" name="dispute_status" type="select" value={form.dispute_status} onChange={handleChange} options={STATUS_OPTIONS} />
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" disabled={saving} style={styles.submitBtn}>{saving ? 'Saving...' : 'Submit Dispute'}</button>
            <button type="button" onClick={() => setModalOpen(false)} style={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 },
  addBtn: { padding: '9px 18px', background: 'var(--accent-red)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 13 },
  filterRow: { display: 'flex', gap: 6, marginBottom: 16 },
  tab: { padding: '7px 14px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' },
  tabActive: { background: 'rgba(255,71,87,0.1)', borderColor: 'var(--accent-red)', color: 'var(--accent-red)' },
  selectInline: { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: 4, padding: '4px 8px', fontSize: 12, fontFamily: 'var(--font-mono)' },
  deleteBtn: { padding: '4px 10px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', color: 'var(--accent-red)', borderRadius: 4, fontSize: 11, fontWeight: 600 },
  msg: { padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid', background: 'var(--bg-card)', marginBottom: 16, fontSize: 13 },
  loadText: { color: 'var(--text-muted)', textAlign: 'center', padding: 48, fontStyle: 'italic' },
  submitBtn: { flex: 1, padding: '11px', background: 'var(--accent-red)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 13 },
  cancelBtn: { padding: '11px 20px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', fontSize: 13 },
};
