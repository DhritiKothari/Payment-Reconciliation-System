import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// ── Transactions ──────────────────────────────────────────────
export const getTransactions = () => API.get('/transactions');
export const addTransaction = (data) => API.post('/transactions', data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const getTransactionStats = () => API.get('/transactions/stats');

// ── Disputes ──────────────────────────────────────────────────
export const getDisputes = () => API.get('/disputes');
export const addDispute = (data) => API.post('/disputes', data);
export const updateDisputeStatus = (id, status) =>
  API.put(`/disputes/${id}`, { dispute_status: status });
export const deleteDispute = (id) => API.delete(`/disputes/${id}`);

// ── Reconciliation ────────────────────────────────────────────
export const getReconciliation = () => API.get('/reconciliation');
export const getReconciliationSummary = () => API.get('/reconciliation/summary');
export const addReconciliation = (data) => API.post('/reconciliation', data);

// ── Customers ─────────────────────────────────────────────────
export const getCustomers = () => API.get('/customers');

export default API;
