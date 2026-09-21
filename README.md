# SmartExpense – Personal Finance Tracker

SmartExpense is a modern, responsive full-stack personal finance management web application built with the **MERN** stack (React.js, Node.js, Express.js, and MongoDB). It enables users to record income and expenses, categorize spending, track current balance, and analyze cash flow trends through interactive charts and real-time dashboard analytics.

---

## 🌟 Key Features

### 1. Interactive Financial Dashboard
- **Summary Cards**: Instantly view Total Income, Total Expenses, Net Balance (`Balance = Income - Expenses`), and Total Transaction count.
- **Spending by Category Chart**: Donut chart visualizing expense distribution across categories with percentage breakdown (using Recharts).
- **Monthly Cash Flow Trend Chart**: Side-by-side bar chart showing monthly income vs. outgoing expenditures.
- **Recent Transactions Feed**: Quick look at the 5 most recent transactions with 1-click access to the full list.
- **Live Auto-Calculations**: Dashboard metrics automatically re-calculate upon creating, editing, or removing any transaction.

### 2. Transaction Management
- **Record Income & Expenses**: Form with dynamic category suggestions, amount, date picker, and optional description.
- **Edit & Update**: Seamlessly modify existing records with pre-filled inputs.
- **Delete with Confirmation**: Safety confirmation modal to prevent accidental deletion.
- **Data Export**: 1-click **Export to CSV** feature to backup or analyze transactions in Excel/Google Sheets.

### 3. Advanced Filtering, Search & Sorting
- **Real-Time Search**: Search through transactions by title or description.
- **Type Filtering**: Filter by All, Income, or Expense.
- **Category Filtering**: Dropdown filtered dynamically based on selected transaction type.
- **Date Range Picker**: Filter records between custom Start and End dates.
- **Multi-criteria Sorting**: Sort by Newest First, Oldest First, Highest Amount, or Lowest Amount.

### 4. Robust RESTful APIs & Validation
- Standardized REST endpoints built with Express.js and Mongoose.
- Strong validation: Title requirement, positive amounts (> 0), valid enum types (`Income` / `Expense`), valid categories, and valid dates.
- Centralized error handling middleware with clear error messages.
- Resilient database layer with automatic in-memory fallback for immediate out-of-the-box local development and testing.

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, React Router v6, Recharts, Lucide React, Axios |
| **Backend** | Node.js, Express.js, Mongoose, CORS, Dotenv |
| **Database** | MongoDB / MongoDB Atlas |
| **Testing & Tooling** | Node Test Runner, Supertest, MongoDB Memory Server |

---

## 📁 Project Structure

```text
SmartExpense–Personal Finance Tracker/
├── client/                     # React Frontend (Vite)
│   ├── public/
│   │   └── favicon.svg         # App favicon
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Charts/
│   │   │   │   ├── ExpenseCategoryChart.jsx  # Category donut chart
│   │   │   │   └── MonthlyTrendChart.jsx     # Income vs Expense bars
│   │   │   ├── CategoryFilter.jsx            # Category filter select
│   │   │   ├── Navbar.jsx                    # Header navigation
│   │   │   ├── NotificationToast.jsx         # Status notifications
│   │   │   ├── SearchBar.jsx                 # Live search bar
│   │   │   ├── SummaryCards.jsx              # KPI metric cards
│   │   │   ├── TransactionForm.jsx           # Add/Edit form
│   │   │   └── TransactionTable.jsx          # Records table & modal
│   │   ├── context/
│   │   │   └── TransactionContext.jsx        # Global state & actions
│   │   ├── pages/
│   │   │   ├── AddTransaction.jsx            # Add transaction view
│   │   │   ├── Dashboard.jsx                 # Main overview dashboard
│   │   │   ├── EditTransaction.jsx           # Edit transaction view
│   │   │   ├── NotFound.jsx                  # 404 error page
│   │   │   └── Transactions.jsx              # Full records & filters
│   │   ├── services/
│   │   │   └── api.js                        # Axios client & endpoints
│   │   ├── utils/
│   │   │   └── formatters.js                 # Currency & date formatters
│   │   ├── App.jsx                           # Application routing
│   │   ├── index.css                         # Tailwind CSS styling
│   │   └── main.jsx                          # React DOM entrypoint
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js                        # Vite config with backend proxy
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                         # Mongoose connection
│   │   ├── controllers/
│   │   │   └── transactionController.js      # CRUD & analytics logic
│   │   ├── middleware/
│   │   │   └── errorHandler.js               # Centralized error handler
│   │   ├── models/
│   │   │   └── Transaction.js                # Schema & validation
│   │   ├── routes/
│   │   │   └── transactionRoutes.js          # REST API route mapping
│   │   ├── seed.js                           # Realistic demo transactions
│   │   ├── server.js                         # Express entrypoint
│   │   └── tests/
│   │       └── api.test.js                   # Automated API test suite
│   ├── .env.example                          # Environment template
│   └── package.json
│
├── package.json                # Root orchestration scripts
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
Create a `.env` file in the `server/` directory (a template is provided in `server/.env.example`):

```env
# Server Port
PORT=5000

# MongoDB URI (Local or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/smartexpense

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
Optional in development as Vite automatically proxies `/api` to `http://localhost:5000`:

```env
VITE_API_URL=/api
```

---

## 🚀 Installation & Running

### Option 1: Quick Start (Single Root Command)

1. **Install root dependencies**:
   ```bash
   npm install
   ```

2. **Install client and server dependencies**:
   ```bash
   npm run install:all
   ```

3. **(Optional) Seed sample data**:
   ```bash
   npm run seed
   ```

4. **Run both Backend and Frontend concurrently**:
   ```bash
   npm run dev
   ```
   - Frontend runs at: `http://localhost:5173`
   - Backend runs at: `http://localhost:5000`

---

### Option 2: Running Separately

#### 1. Backend
```bash
cd server
npm install
npm run seed     # Optional: seeds 12 realistic transactions
npm run dev      # Starts Express with nodemon on port 5000
```

#### 2. Frontend
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on port 5173
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/health` | Service health check | - |
| `GET` | `/api/transactions` | Fetch all transactions | `search`, `type`, `category`, `startDate`, `endDate`, `sort` |
| `POST` | `/api/transactions` | Create new transaction | Request body: `{ title, amount, type, category, date, description }` |
| `GET` | `/api/transactions/:id` | Fetch single transaction | - |
| `PUT` | `/api/transactions/:id` | Update transaction | Request body fields to update |
| `DELETE` | `/api/transactions/:id` | Delete transaction | - |
| `GET` | `/api/transactions/summary` | Get financial metrics & chart data | - |
| `GET` | `/api/transactions/categories` | Get predefined categories | - |

---

## 🧪 Testing

The backend includes an automated test suite verifying CRUD operations, business calculations, and validation rules:

```bash
cd server
npm test
```

---

## 📸 Screenshots

*(Placeholder for application screenshots)*
- **Dashboard Overview**: Financial KPIs, Category Donut Chart, Cash Flow Bar Chart, Recent Transactions.
- **Transaction History**: Search, filters, sort, and CSV export.
- **Add / Edit Transaction**: Form validation and type toggling.

---

## 🔮 Future Improvements
- User authentication & multi-user profiles (JWT Auth).
- Recurring subscriptions and bill reminders.
- Budget goals and spending limit alerts per category.
- Multi-currency conversion support.
- Receipt image uploads with OCR text recognition.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
