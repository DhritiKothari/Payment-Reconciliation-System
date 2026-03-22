const express = require('express');
const router = express.Router();
const db = require('../db');
 
// GET all transactions
router.get('/', (req, res) => {
  db.query('SELECT * FROM Transaction ORDER BY date_time DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
 
// GET transaction stats (for dashboard charts)
router.get('/stats', (req, res) => {
  const query = `
    SELECT
      COUNT(*) AS total,
      SUM(amount) AS total_amount,
      AVG(amount) AS avg_amount,
      MAX(amount) AS max_amount,
      MIN(amount) AS min_amount,
      SUM(CASE WHEN status='SUCCESS' THEN 1 ELSE 0 END) AS success_count,
      SUM(CASE WHEN status='FAILED'  THEN 1 ELSE 0 END) AS failed_count,
      SUM(CASE WHEN status='PENDING' THEN 1 ELSE 0 END) AS pending_count
    FROM Transaction
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});
 
// POST new transaction
router.post('/', (req, res) => {
  const { transaction_id, customer_id, amount, date_time, status } = req.body;
  if (!transaction_id || !customer_id || !amount || !status)
    return res.status(400).json({ error: 'Missing required fields' });
  const sql = 'INSERT INTO Transaction (transaction_id, customer_id, amount, date_time, status) VALUES (?,?,?,?,?)';
  db.query(sql, [transaction_id, customer_id, amount, date_time || new Date(), status], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Transaction added', transaction_id });
  });
});
 
// DELETE transaction
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Transaction WHERE transaction_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Transaction deleted' });
  });
});
 
module.exports = router;
 