import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import PageHeader from '../components/PageHeader';
import { getTransactions, addTransaction, deleteTransaction } from '../api';

const STATUS_OPTIONS = [
  { value: 'SUCCESS', label: 'SUCCESS' },
  { value: 'FAILED', label: 'FAILED' },
  { value: 'PENDING', label: 'PENDING' },
  { value: 'PROCESSING', label: 'PROCESSING' },
];

const DEMO_DATA = [
  { transaction_id: 101, customer_id: 1, amount: 2500.00, status: 'SUCCESS', date_time: '2025-01-10T10:30:00' },
  { transaction_id: 102, customer_id: 2, amount: 120.00, status: 'FAILED', date_time: '2025-01-11T11:15:00' },
  { transaction_id: 103, customer_id: 3, amount: 5000.00, status: 'SUCCESS', date_time: '2025-01-12T14:45:00' },
  { transaction_id: 104, customer_id: 4, amount: 800.00, status: 'PENDING', date_time: '2025-01-13T09:20:00' },
  { transaction_id: 105, customer_id: 5, amount: 7500.00, status: 'SUCCESS', date_time: '2025-01-14T16:00:00' },
  { transaction_id: 106, customer_id: 1, amount: 60.00, status: 'FAILED', date_time: '2025-01-15T18:30:00' },
];

const EMPTY_FORM = { transaction_id: '', customer_id: '', amount: '', date_time: '', status: '' };

export default function Transactions() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => {
    setLoading(true);
    getTransactions()
      .then(r => setData(r.data))
      .catch(() => setData(DEMO_DATA))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    let res = data;
    if (statusFilter !== 'ALL') res = res.filter(t => t.status === statusFilter);
    if (search) res = res.filter(t =>
      String(t.transaction_id).includes(search) ||
      String(t.customer_id).includes(search) ||
      String(t.amount).includes(search)
    );
    setFiltered(res);
  }, [data, search, statusFilter]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await addTransaction(form);
      setMsg({ type: 'success', text: 'Transaction added successfully!' });
      setModalOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch {
      setMsg({ type: 'error', text: 'Failed to add transaction. Check backend connection.' });
    } finally { setSaving(false); setTimeout(() => setMsg(null), 3000); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete transaction #${id}?`)) return;
    try {
      await deleteTransaction(id);
      setData(d => d.filter(t => t.transaction_id !== id));
      setMsg({ type: 'success', text: 'Deleted.' });
    } catch { setMsg({ type: 'error', text: 'Delete failed.' }); }
    setTimeout(() => setMsg(null), 3000);
  };

  const COLS = [
    { key: 'transaction_id', label: 'Txn ID', render: v => <span style={{ color: 'var(--accent-cyan)' }}>#{v}</span> },
    { key: 'customer_id', label: 'Customer', render: v => `CUST-${v}` },
    { key: 'amount', label: 'Amount', render: v => `₹${parseFloat(v).toLocaleString('en-IN')}` },
    { key: 'date_time', label: 'Date & Time', render: v => v ? new Date(v).toLocaleString('en-IN') : '—' },
    { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
    { key: 'transaction_id', label: 'Actions', render: (_, row) => (
      <button onClick={() => handleDelete(row.transaction_id)} style={styles.deleteBtn}>Delete</button>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle={`${filtered.length} records`}
        action={
          <button onClick={() => setModalOpen(true)} style={styles.addBtn}>
            + Add Transaction
          </button>
        }
      />

      {msg && (
        <div style={{ ...styles.msg, borderColor: msg.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)', color: msg.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {msg.text}
        </div>
      )}

      {/* Filters */}
      <div style={styles.filters}>
        <input
          placeholder="Search by ID, customer, amount..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.statusTabs}>
          {['ALL', 'SUCCESS', 'FAILED', 'PENDING', 'PROCESSING'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{ ...styles.tab, ...(statusFilter === s ? styles.tabActive : {}) }}
            >{s}</button>
          ))}
        </div>
      </div>

      {loading ? <div style={styles.loadingText}>Loading transactions...</div> : <Table columns={COLS} data={filtered} />}

      {/* Amount summary */}
      <div style={styles.summary}>
        <span style={{ color: 'var(--text-muted)' }}>Showing {filtered.length} records · Total: </span>
        <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          ₹{filtered.reduce((s, t) => s + parseFloat(t.amount || 0), 0).toLocaleString('en-IN')}
        </span>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Transaction">
        <form onSubmit={handleSubmit}>
          <FormField label="Transaction ID" name="transaction_id" value={form.transaction_id} onChange={handleChange} required />
          <FormField label="Customer ID" name="customer_id" value={form.customer_id} onChange={handleChange} required />
          <FormField label="Amount (₹)" name="amount" type="number" value={form.amount} onChange={handleChange} required />
          <FormField label="Date & Time" name="date_time" type="datetime-local" value={form.date_time} onChange={handleChange} />
          <FormField label="Status" name="status" type="select" value={form.status} onChange={handleChange} options={STATUS_OPTIONS} required />
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" disabled={saving} style={styles.submitBtn}>{saving ? 'Saving...' : 'Save Transaction'}</button>
            <button type="button" onClick={() => setModalOpen(false)} style={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  addBtn: { padding: '9px 18px', background: 'var(--accent-cyan)', color: '#080c14', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 13, letterSpacing: '0.03em' },
  filters: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
  searchInput: { flex: 1, minWidth: 220, padding: '9px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' },
  statusTabs: { display: 'flex', gap: 4 },
  tab: { padding: '7px 12px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', transition: 'all 0.15s' },
  tabActive: { background: 'rgba(0,212,255,0.12)', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' },
  summary: { marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' },
  deleteBtn: { padding: '4px 10px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', color: 'var(--accent-red)', borderRadius: 4, fontSize: 11, fontWeight: 600 },
  msg: { padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid', background: 'var(--bg-card)', marginBottom: 16, fontSize: 13 },
  loadingText: { color: 'var(--text-muted)', textAlign: 'center', padding: 48, fontStyle: 'italic' },
  submitBtn: { flex: 1, padding: '11px', background: 'var(--accent-cyan)', color: '#080c14', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 13 },
  cancelBtn: { padding: '11px 20px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', fontSize: 13 },
};
