const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { Transaction } = require('../models/Transaction');

let app;
let createdTransactionId;

test.before(async () => {
  process.env.NODE_ENV = 'test';
  Transaction._clearMemoryStore();
  app = require('../server');
});

test('GET /api/health - Returns 200 and health status', async () => {
  const res = await request(app).get('/api/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
  assert.strictEqual(res.body.service, 'SmartExpense API');
});

test('GET /api/transactions/categories - Returns predefined category lists', async () => {
  const res = await request(app).get('/api/transactions/categories');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(Array.isArray(res.body.data.expense));
  assert.ok(Array.isArray(res.body.data.income));
  assert.ok(res.body.data.expense.includes('Food'));
  assert.ok(res.body.data.expense.includes('Bills'));
  assert.ok(res.body.data.income.includes('Salary'));
  assert.ok(res.body.data.income.includes('Freelance'));
});

test('POST /api/transactions - Fails if required fields are missing', async () => {
  const res = await request(app)
    .post('/api/transactions')
    .send({ title: 'Incomplete' });

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.success, false);
});

test('POST /api/transactions - Fails if amount is negative or zero', async () => {
  const res = await request(app)
    .post('/api/transactions')
    .send({
      title: 'Invalid Amount',
      amount: -25,
      type: 'Expense',
      category: 'Food',
    });

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.success, false);
});

test('POST /api/transactions - Creates a new income transaction', async () => {
  const res = await request(app)
    .post('/api/transactions')
    .send({
      title: 'Freelance Web Design',
      amount: 1500,
      type: 'Income',
      category: 'Freelance',
      date: new Date().toISOString(),
      description: 'Client payment for website',
    });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.title, 'Freelance Web Design');
  assert.strictEqual(res.body.data.amount, 1500);
  assert.strictEqual(res.body.data.type, 'Income');
});

test('POST /api/transactions - Creates a new expense transaction', async () => {
  const res = await request(app)
    .post('/api/transactions')
    .send({
      title: 'Grocery Supermarket',
      amount: 300,
      type: 'Expense',
      category: 'Food',
      date: new Date().toISOString(),
      description: 'Weekly vegetables and pantry items',
    });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.title, 'Grocery Supermarket');
  assert.strictEqual(res.body.data.amount, 300);
  assert.strictEqual(res.body.data.type, 'Expense');
  createdTransactionId = res.body.data._id;
});

test('GET /api/transactions - Returns transaction list, filtering, and search', async () => {
  const res = await request(app).get('/api/transactions');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.count, 2);

  // Filter by type: Expense
  const expenseRes = await request(app).get('/api/transactions?type=Expense');
  assert.strictEqual(expenseRes.status, 200);
  assert.strictEqual(expenseRes.body.count, 1);
  assert.strictEqual(expenseRes.body.data[0].type, 'Expense');

  // Search by keyword
  const searchRes = await request(app).get('/api/transactions?search=Freelance');
  assert.strictEqual(searchRes.status, 200);
  assert.strictEqual(searchRes.body.count, 1);
  assert.strictEqual(searchRes.body.data[0].title, 'Freelance Web Design');
});

test('GET /api/transactions/summary - Calculates accurate totals, balance, and category breakdown', async () => {
  const res = await request(app).get('/api/transactions/summary');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.totalIncome, 1500);
  assert.strictEqual(res.body.data.totalExpenses, 300);
  assert.strictEqual(res.body.data.balance, 1200); // 1500 - 300 = 1200
  assert.strictEqual(res.body.data.transactionCount, 2);
  assert.ok(Array.isArray(res.body.data.categoryExpenses));
  assert.strictEqual(res.body.data.categoryExpenses[0].category, 'Food');
  assert.strictEqual(res.body.data.categoryExpenses[0].amount, 300);
});

test('GET /api/transactions/:id - Retrieves single transaction', async () => {
  const res = await request(app).get(`/api/transactions/${createdTransactionId}`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data._id, createdTransactionId);
  assert.strictEqual(res.body.data.title, 'Grocery Supermarket');
});

test('PUT /api/transactions/:id - Updates transaction amount and title', async () => {
  const res = await request(app)
    .put(`/api/transactions/${createdTransactionId}`)
    .send({
      title: 'Grocery Supermarket (Organic)',
      amount: 350,
    });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.title, 'Grocery Supermarket (Organic)');
  assert.strictEqual(res.body.data.amount, 350);
});

test('DELETE /api/transactions/:id - Deletes transaction', async () => {
  const res = await request(app).delete(`/api/transactions/${createdTransactionId}`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);

  // Verify it is no longer retrievable
  const checkRes = await request(app).get(`/api/transactions/${createdTransactionId}`);
  assert.strictEqual(checkRes.status, 404);
});
