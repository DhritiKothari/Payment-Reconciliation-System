const express = require('express');
const router = express.Router();
const db = require('../db');
 
router.get('/', (req, res) => {
  db.query('SELECT * FROM Customer ORDER BY customer_id', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
 
module.exports = router;
 