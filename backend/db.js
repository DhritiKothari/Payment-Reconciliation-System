const mysql = require('mysql2');
 
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'payment_reconciliation',
});
 
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.log('   Make sure MySQL is running and credentials are correct in backend/.env');
  } else {
    console.log('✅ MySQL connected to payment_reconciliation');
  }
});
 
module.exports = db;
 