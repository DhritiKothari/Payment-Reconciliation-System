const express = require('express');
const router = express.Router();
const db = require('../db');
 
router.get('/', (req, res) => {
  db.query('SELECT * FROM Dispute ORDER BY dispute_id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
 
router.post('/', (req, res) => {
  const { dispute_id, transaction_id, issue_type, dispute_status } = req.body;
  if (!dispute_id || !transaction_id || !issue_type)
    return res.status(400).json({ error: 'Missing required fields' });
  db.query(
    'INSERT INTO Dispute (dispute_id, transaction_id, issue_type, dispute_status) VALUES (?,?,?,?)',
    [dispute_id, transaction_id, issue_type, dispute_status || 'OPEN'],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Dispute created' });
    }
  );
});
 
router.put('/:id', (req, res) => {
  const { dispute_status } = req.body;
  db.query('UPDATE Dispute SET dispute_status=? WHERE dispute_id=?',
    [dispute_status, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Status updated' });
    });
});
 
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Dispute WHERE dispute_id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Dispute deleted' });
  });
});
 
module.exports = router;
 