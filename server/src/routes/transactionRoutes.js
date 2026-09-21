const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getCategories,
} = require('../controllers/transactionController');

// Summary and categories specific endpoints (must be before /:id)
router.get('/summary', getTransactionSummary);
router.get('/categories', getCategories);

// Main CRUD endpoints
router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
