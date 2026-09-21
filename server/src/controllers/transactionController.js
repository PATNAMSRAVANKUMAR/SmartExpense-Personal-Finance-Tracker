const { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES, ALL_CATEGORIES } = require('../models/Transaction');

/**
 * @desc   Get all transactions with optional search, filters, and sorting
 * @route  GET /api/transactions
 * @access Public
 */
const getTransactions = async (req, res, next) => {
  try {
    const { search, type, category, startDate, endDate, sort = 'newest' } = req.query;

    const query = {};

    // Filter by type (Income / Expense)
    if (type && ['Income', 'Expense'].includes(type)) {
      query.type = type;
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of the day if date string like YYYY-MM-DD
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Search by title or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Sorting
    let sortOption = { date: -1, createdAt: -1 }; // newest by default
    if (sort === 'oldest') {
      sortOption = { date: 1, createdAt: 1 };
    } else if (sort === 'amount-high') {
      sortOption = { amount: -1 };
    } else if (sort === 'amount-low') {
      sortOption = { amount: 1 };
    }

    const transactions = await Transaction.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single transaction by ID
 * @route  GET /api/transactions/:id
 * @access Public
 */
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new transaction
 * @route  POST /api/transactions
 * @access Public
 */
const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    // Validate required fields explicitly
    if (!title || !amount || !type || !category) {
      res.status(400);
      throw new Error('Please provide title, amount, type, and category');
    }

    if (Number(amount) <= 0) {
      res.status(400);
      throw new Error('Amount must be greater than 0');
    }

    if (!['Income', 'Expense'].includes(type)) {
      res.status(400);
      throw new Error('Type must be either Income or Expense');
    }

    const transaction = await Transaction.create({
      title: title.trim(),
      amount: Number(amount),
      type,
      category: category.trim(),
      date: date ? new Date(date) : new Date(),
      description: description ? description.trim() : '',
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update an existing transaction
 * @route  PUT /api/transactions/:id
 * @access Public
 */
const updateTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    if (amount !== undefined && Number(amount) <= 0) {
      res.status(400);
      throw new Error('Amount must be greater than 0');
    }

    if (type !== undefined && !['Income', 'Expense'].includes(type)) {
      res.status(400);
      throw new Error('Type must be either Income or Expense');
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(amount !== undefined && { amount: Number(amount) }),
        ...(type !== undefined && { type }),
        ...(category !== undefined && { category: category.trim() }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(description !== undefined && { description: description.trim() }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete transaction
 * @route  DELETE /api/transactions/:id
 * @access Public
 */
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get financial summary and analytics
 * @route  GET /api/transactions/summary
 * @access Public
 */
const getTransactionSummary = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryExpensesMap = {};
    const categoryIncomeMap = {};
    const monthlyMap = {};

    transactions.forEach((tx) => {
      const amount = Number(tx.amount);
      const txDate = new Date(tx.date);
      const monthYear = txDate.toLocaleString('default', { month: 'short', year: 'numeric' });

      // Initialize monthly map
      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = {
          month: monthYear,
          income: 0,
          expenses: 0,
          timestamp: new Date(txDate.getFullYear(), txDate.getMonth(), 1).getTime(),
        };
      }

      if (tx.type === 'Income') {
        totalIncome += amount;
        categoryIncomeMap[tx.category] = (categoryIncomeMap[tx.category] || 0) + amount;
        monthlyMap[monthYear].income += amount;
      } else if (tx.type === 'Expense') {
        totalExpenses += amount;
        categoryExpensesMap[tx.category] = (categoryExpensesMap[tx.category] || 0) + amount;
        monthlyMap[monthYear].expenses += amount;
      }
    });

    const balance = totalIncome - totalExpenses;

    // Convert category map to array with percentages
    const categoryExpenses = Object.entries(categoryExpensesMap).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    })).sort((a, b) => b.amount - a.amount);

    // Convert monthly map to chronological sorted array (last 6 to 12 months)
    const monthlySummary = Object.values(monthlyMap)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ month, income, expenses }) => ({
        month,
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        net: Math.round((income - expenses) * 100) / 100,
      }));

    // Recent 5 transactions
    const recentTransactions = transactions.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        balance: Math.round(balance * 100) / 100,
        transactionCount: transactions.length,
        categoryExpenses,
        monthlySummary,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get predefined categories for income and expense
 * @route  GET /api/transactions/categories
 * @access Public
 */
const getCategories = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        expense: EXPENSE_CATEGORIES,
        income: INCOME_CATEGORIES,
        all: ALL_CATEGORIES,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getCategories,
};
