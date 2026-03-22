# Payment-Reconciliation-System — Financial Transaction Reconciliation & Dispute Management System
### Full-Stack Setup Guide

---

## PROJECT STRUCTURE

```
project/
├── backend/
│   ├── server.js              ← Express API entry point
│   ├── db.js                  ← MySQL connection
│   ├── package.json
│   ├── .env                   ← ⚠ Add your MySQL password here
│   └── routes/
│       ├── transactions.js    ← GET, POST, DELETE /transactions
│       ├── disputes.js        ← GET, POST, PUT, DELETE /disputes
│       ├── reconciliation.js  ← GET, POST /reconciliation
│       └── customers.js       ← GET /customers
│
├── frontend/
│   ├── package.json
│   └── src/
│       ├── index.js           ← React entry point
│       ├── index.css          ← Global styles + CSS variables
│       ├── App.jsx            ← Router + Sidebar layout
│       ├── api.js             ← All Axios API calls (centralized)
│       ├── pages/
│       │   ├── Dashboard.jsx      ← Stats cards + Bar/Pie charts
│       │   ├── Transactions.jsx   ← Full CRUD table with filters
│       │   ├── Disputes.jsx       ← Dispute tracker + status updates
│       │   └── Reconciliation.jsx ← Recon records + match progress
│       └── components/
│           ├── StatCard.jsx    ← Reusable KPI card
│           ├── StatusBadge.jsx ← Colored status pill
│           ├── Table.jsx       ← Reusable data table
│           ├── Modal.jsx       ← Dialog / form overlay
│           ├── FormField.jsx   ← Input + Select wrapper
│           └── PageHeader.jsx  ← Page title + action button
│
└── README.md
```

---

## STEP 1 — PREREQUISITES

Make sure these are installed:
```
Node.js v18+     → https://nodejs.org
MySQL 8.0+       → Already installed (you have MySQL Workbench)
npm              → Comes with Node.js
```

Verify:
```bash
node -v      # should show v18.x or higher
npm -v       # should show 9.x or higher
mysql --version
```

---

## STEP 2 — BACKEND SETUP

```bash
# 1. Go into backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Open .env and set your MySQL root password
#    Change: DB_PASSWORD=your_mysql_password_here
#    To:     DB_PASSWORD=yourActualPassword

# 4. Make sure your MySQL database exists
#    (You already created it in your DBMS project!)
#    If not, run in MySQL:
#    CREATE DATABASE payment_reconciliation;

# 5. Start the server
npm run dev        # development (auto-restarts on file change)
# OR
npm start          # production

# You should see:
# ✅ MySQL connected to payment_reconciliation
# 🚀 PayRec API running at http://localhost:5000
```

**Test the API** — open browser or Postman:
```
http://localhost:5000/health          → { status: "OK" }
http://localhost:5000/transactions    → [...array of transactions]
http://localhost:5000/disputes        → [...array of disputes]
http://localhost:5000/reconciliation  → [...array of reconciliation records]
```

---

## STEP 3 — FRONTEND SETUP

Open a NEW terminal (keep backend running):
```bash
# 1. Go into frontend folder
cd frontend

# 2. Install dependencies (this takes 2-3 minutes first time)
npm install

# 3. Start React development server
npm start

# Browser will open automatically at http://localhost:3000
```

---

## STEP 4 — VERIFY FULL STACK WORKS

1. Backend running on port 5000 ✓
2. Frontend running on port 3000 ✓
3. Open http://localhost:3000
4. Dashboard shows real data from your MySQL database ✓

**If backend is not running**, the frontend automatically shows
demo data so you can still see the UI.

---

## API REFERENCE

### Transactions
| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | /transactions         | Get all transactions         |
| GET    | /transactions/stats   | Aggregate stats (COUNT, SUM) |
| POST   | /transactions         | Add new transaction          |
| DELETE | /transactions/:id     | Delete transaction           |

### Disputes
| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| GET    | /disputes       | Get all disputes         |
| POST   | /disputes       | Create new dispute       |
| PUT    | /disputes/:id   | Update dispute status    |
| DELETE | /disputes/:id   | Remove dispute           |

### Reconciliation
| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| GET    | /reconciliation          | Get all records          |
| GET    | /reconciliation/summary  | Matched vs Unmatched     |
| POST   | /reconciliation          | Add record               |

---

## COMMON ERRORS & FIXES

| Error | Fix |
|-------|-----|
| `ER_ACCESS_DENIED` | Wrong password in backend/.env |
| `ER_BAD_DB_ERROR` | Database doesn't exist — run `CREATE DATABASE payment_reconciliation;` |
| `ECONNREFUSED 3306` | MySQL server not running — start MySQL service |
| `ECONNREFUSED 5000` | Backend not started — run `npm run dev` in backend/ |
| `Module not found` | Run `npm install` again in the failing folder |
| Port 3000 in use | Change port: `PORT=3001 npm start` |

---

## FEATURES

- **Dashboard** — Real-time KPI cards, bar chart by status, pie chart for reconciliation
- **Transactions** — Filter by status, search, add new, delete records
- **Disputes** — Raise disputes, update status (OPEN → ESCALATED → RESOLVED), delete
- **Reconciliation** — Track match rate, progress bar, add manual records
- **Demo mode** — Works without backend using built-in sample data
- **Dark theme** — Professional financial dashboard aesthetic

---

## NEXT FEATURES TO ADD (Phase 2)

1. **Authentication** — Login page with JWT tokens (`npm install jsonwebtoken bcrypt`)
2. **Auto-reconciliation** — Button that runs SQL comparison and fills Reconciliation table
3. **Export to CSV** — Download transaction/dispute reports
4. **Email alerts** — Notify on new disputes (`npm install nodemailer`)
5. **Date range filter** — Filter transactions by date
6. **Customer management page** — View/add customers
