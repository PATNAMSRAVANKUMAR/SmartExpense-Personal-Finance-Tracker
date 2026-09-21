const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Transaction } = require('./models/Transaction');

dotenv.config();

const sampleTransactions = [
  {
    title: 'Monthly Tech Salary',
    amount: 5200.00,
    type: 'Income',
    category: 'Salary',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
    description: 'Direct deposit monthly engineering salary'
  },
  {
    title: 'UI/UX Freelance Project',
    amount: 1450.00,
    type: 'Income',
    category: 'Freelance',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), // 12 days ago
    description: 'Landing page redesign milestone payout'
  },
  {
    title: 'Whole Foods Grocery Run',
    amount: 142.50,
    type: 'Expense',
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    description: 'Weekly organic groceries, vegetables, and pantry items'
  },
  {
    title: 'Apartment Rent & Water',
    amount: 1650.00,
    type: 'Expense',
    category: 'Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), // 21 days ago
    description: 'Monthly apartment rent lease payment'
  },
  {
    title: 'High-Speed Internet Fiber',
    amount: 79.99,
    type: 'Expense',
    category: 'Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    description: 'Gigabit fiber optic home connection'
  },
  {
    title: 'Gas & EV Fast Charging',
    amount: 54.20,
    type: 'Expense',
    category: 'Transportation',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    description: 'Commute fuel and highway toll reload'
  },
  {
    title: 'Dinner at Italian Bistro',
    amount: 86.40,
    type: 'Expense',
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    description: 'Weekend family dinner'
  },
  {
    title: 'Online Course & Books',
    amount: 65.00,
    type: 'Expense',
    category: 'Education',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    description: 'Cloud Architecture certification preparation'
  },
  {
    title: 'Weekend Cinema & Streaming',
    amount: 45.00,
    type: 'Expense',
    category: 'Entertainment',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    description: 'Movie tickets and quarterly streaming renewal'
  },
  {
    title: 'Ergonomic Chair Upgrade',
    amount: 289.00,
    type: 'Expense',
    category: 'Shopping',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), // 9 days ago
    description: 'Home office desk chair for posture support'
  },
  {
    title: 'Prescription & Vitamins',
    amount: 38.50,
    type: 'Expense',
    category: 'Healthcare',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    description: 'Monthly vitamins and prescription refill'
  },
  {
    title: 'E-commerce Affiliate Commission',
    amount: 320.00,
    type: 'Income',
    category: 'Business',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
    description: 'Monthly digital affiliate sales payout'
  }
];

const seedData = async () => {
  try {
    const count = await Transaction.countDocuments();
    if (count > 0) {
      console.log(`ℹ️ Database already contains ${count} transactions. Purging old records for fresh seed...`);
      await Transaction.deleteMany({});
    }

    const inserted = await Transaction.insertMany(sampleTransactions);
    console.log(`🌱 Successfully seeded ${inserted.length} realistic sample transactions!`);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  }
};

// If run directly: node src/seed.js
if (require.main === module) {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartexpense';
  mongoose.connect(uri)
    .then(async () => {
      console.log('Connected to MongoDB for seeding...');
      await seedData();
      await mongoose.disconnect();
      console.log('Done. Disconnected.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Could not connect to MongoDB for seeding:', err.message);
      process.exit(1);
    });
}

module.exports = { seedData, sampleTransactions };
