const mongoose = require('mongoose');

const EXPENSE_CATEGORIES = [
  'Food',
  'Shopping',
  'Transportation',
  'Bills',
  'Entertainment',
  'Education',
  'Healthcare',
  'Other'
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Other'
];

const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

// Mongoose Schema Definition
const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a transaction title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than 0']
    },
    type: {
      type: String,
      required: [true, 'Please specify transaction type'],
      enum: {
        values: ['Income', 'Expense'],
        message: 'Type must be either Income or Expense'
      }
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
      enum: {
        values: ALL_CATEGORIES,
        message: 'Invalid category selected'
      }
    },
    date: {
      type: Date,
      required: [true, 'Please provide a valid date'],
      default: Date.now
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });

const TransactionModel = mongoose.model('Transaction', transactionSchema);

// Initial realistic dataset for in-memory fallback
const initialSampleData = [
  {
    _id: '66ef71a2b1c3d4e5f6000001',
    title: 'Monthly Tech Salary',
    amount: 5200.00,
    type: 'Income',
    category: 'Salary',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    description: 'Direct deposit monthly engineering salary',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000002',
    title: 'UI/UX Freelance Project',
    amount: 1450.00,
    type: 'Income',
    category: 'Freelance',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    description: 'Landing page redesign milestone payout',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000003',
    title: 'Whole Foods Grocery Run',
    amount: 142.50,
    type: 'Expense',
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    description: 'Weekly organic groceries, vegetables, and pantry items',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000004',
    title: 'Apartment Rent & Water',
    amount: 1650.00,
    type: 'Expense',
    category: 'Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
    description: 'Monthly apartment rent lease payment',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000005',
    title: 'High-Speed Internet Fiber',
    amount: 79.99,
    type: 'Expense',
    category: 'Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    description: 'Gigabit fiber optic home connection',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000006',
    title: 'Gas & EV Fast Charging',
    amount: 54.20,
    type: 'Expense',
    category: 'Transportation',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    description: 'Commute fuel and highway toll reload',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000007',
    title: 'Dinner at Italian Bistro',
    amount: 86.40,
    type: 'Expense',
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    description: 'Weekend family dinner',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000008',
    title: 'Online Course & Books',
    amount: 65.00,
    type: 'Expense',
    category: 'Education',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    description: 'Cloud Architecture certification preparation',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000009',
    title: 'Weekend Cinema & Streaming',
    amount: 45.00,
    type: 'Expense',
    category: 'Entertainment',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    description: 'Movie tickets and quarterly streaming renewal',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000010',
    title: 'Ergonomic Chair Upgrade',
    amount: 289.00,
    type: 'Expense',
    category: 'Shopping',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    description: 'Home office desk chair for posture support',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000011',
    title: 'Prescription & Vitamins',
    amount: 38.50,
    type: 'Expense',
    category: 'Healthcare',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    description: 'Monthly vitamins and prescription refill',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
  },
  {
    _id: '66ef71a2b1c3d4e5f6000012',
    title: 'E-commerce Affiliate Commission',
    amount: 320.00,
    type: 'Income',
    category: 'Business',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    description: 'Monthly digital affiliate sales payout',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
  }
];

let memoryStore = [...initialSampleData];

/**
 * Resilient Transaction Layer
 * Automatically delegates to Mongoose when connected to live MongoDB,
 * or serves from memory store if MongoDB is not running.
 */
const Transaction = {
  find: (query = {}) => {
    if (mongoose.connection.readyState === 1) {
      return TransactionModel.find(query);
    }

    // In-memory query simulation
    return {
      sort: (sortOption = {}) => {
        let results = [...memoryStore];

        // Filter by type
        if (query.type) {
          results = results.filter((item) => item.type === query.type);
        }

        // Filter by category
        if (query.category) {
          results = results.filter((item) => item.category === query.category);
        }

        // Filter by date range
        if (query.date) {
          if (query.date.$gte) {
            results = results.filter((item) => new Date(item.date) >= query.date.$gte);
          }
          if (query.date.$lte) {
            results = results.filter((item) => new Date(item.date) <= query.date.$lte);
          }
        }

        // Filter by search ($or)
        if (query.$or) {
          results = results.filter((item) => {
            return query.$or.some((condition) => {
              if (condition.title) return condition.title.test(item.title);
              if (condition.description) return condition.description.test(item.description);
              return false;
            });
          });
        }

        // Sort
        if (sortOption.date === 1) {
          results.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortOption.date === -1) {
          results.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortOption.amount === 1) {
          results.sort((a, b) => a.amount - b.amount);
        } else if (sortOption.amount === -1) {
          results.sort((a, b) => b.amount - a.amount);
        }

        return Promise.resolve(results);
      },
      then: (resolve, reject) => {
        return Transaction.find(query).sort({ date: -1 }).then(resolve, reject);
      },
    };
  },

  findById: (id) => {
    if (mongoose.connection.readyState === 1) {
      return TransactionModel.findById(id);
    }
    const found = memoryStore.find((t) => String(t._id) === String(id));
    return Promise.resolve(found || null);
  },

  create: (data) => {
    if (mongoose.connection.readyState === 1) {
      return TransactionModel.create(data);
    }
    const newDoc = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...data,
      date: new Date(data.date || Date.now()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.unshift(newDoc);
    return Promise.resolve(newDoc);
  },

  findByIdAndUpdate: (id, updates, options = {}) => {
    if (mongoose.connection.readyState === 1) {
      return TransactionModel.findByIdAndUpdate(id, updates, options);
    }
    const index = memoryStore.findIndex((t) => String(t._id) === String(id));
    if (index === -1) return Promise.resolve(null);

    const updated = {
      ...memoryStore[index],
      ...updates,
      updatedAt: new Date(),
    };
    memoryStore[index] = updated;
    return Promise.resolve(updated);
  },

  findByIdAndDelete: (id) => {
    if (mongoose.connection.readyState === 1) {
      return TransactionModel.findByIdAndDelete(id);
    }
    const index = memoryStore.findIndex((t) => String(t._id) === String(id));
    if (index === -1) return Promise.resolve(null);
    const deleted = memoryStore.splice(index, 1)[0];
    return Promise.resolve(deleted);
  },

  deleteMany: (query = {}) => {
    if (mongoose.connection.readyState === 1) {
      return TransactionModel.deleteMany(query);
    }
    memoryStore = [];
    return Promise.resolve({ deletedCount: 0 });
  },

  insertMany: (docs) => {
    if (mongoose.connection.readyState === 1) {
      return TransactionModel.insertMany(docs);
    }
    const formatted = docs.map((d) => ({
      _id: new mongoose.Types.ObjectId().toString(),
      ...d,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    memoryStore.push(...formatted);
    return Promise.resolve(formatted);
  },

  countDocuments: (query = {}) => {
    if (mongoose.connection.readyState === 1) {
      return TransactionModel.countDocuments(query);
    }
    return Promise.resolve(memoryStore.length);
  },

  // Expose memory store reset for testing
  _resetMemoryStore: () => {
    memoryStore = [...initialSampleData];
  },
  _clearMemoryStore: () => {
    memoryStore = [];
  },
};

module.exports = {
  Transaction,
  TransactionModel,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  ALL_CATEGORIES,
};
