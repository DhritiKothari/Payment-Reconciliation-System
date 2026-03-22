const express = require('express');
const cors = require('cors');
require('dotenv').config();
 
const app = express();
 
// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
 
// Routes
app.use('/transactions',   require('./routes/transactions'));
app.use('/disputes',       require('./routes/disputes'));
app.use('/reconciliation', require('./routes/reconciliation'));
app.use('/customers',      require('./routes/customers'));
 
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'PayRec API running', timestamp: new Date() });
});
 
// 404 handler
app.use((req, res) => res.status(404).json({ error: `Route ${req.path} not found` }));
 
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 PayRec API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});
 