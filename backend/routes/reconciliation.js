const express = require('express');
const router = express.Router();
const db = require('../db');
 
router.get('/', (req, res) => {
  db.query('SELECT * FROM Reconciliation ORDER BY reconciliation_id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
 
router.get('/summary', (req, res) => {
  db.query('SELECT match_status, COUNT(*) as total FROM Reconciliation GROUP BY match_status', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
 
router.post('/', (req, res) => {
  const { reconciliation_id, transaction_id, match_status, remarks } = req.body;
  if (!reconciliation_id || !transaction_id)
    return res.status(400).json({ error: 'Missing required fields' });
  db.query(
    'INSERT INTO Reconciliation (reconciliation_id, transaction_id, match_status, remarks) VALUES (?,?,?,?)',
    [reconciliation_id, transaction_id, match_status || 'MATCHED', remarks || ''],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Reconciliation record added' });
    }
  );
});
 
module.exports = router;
 