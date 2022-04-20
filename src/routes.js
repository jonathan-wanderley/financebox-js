const express = require('express');
const AuthController = require('./controllers/AuthController');
const router = express.Router();
const TransactionController = require('./controllers/TransactionController');
const Auth = require('./middlewares/Auth');
const AuthValidator = require('./validators/AuthValidator');
const TransactionValidator = require('./validators/TransactionValidator');

//Authentication routes
router.post('/signup', AuthValidator.signup, AuthController.signup);
router.post('/signin', AuthValidator.signin, AuthController.signin);

//Transactions
router.get('/transactions', Auth.private, TransactionController.getTransactions);
router.post('/transactions', Auth.private, TransactionValidator.add, TransactionController.addTransaction);
router.put('/transactions/:id', Auth.private, TransactionValidator.edit, TransactionController.editTransaction);
router.delete('/transactions/:id', Auth.private, TransactionController.removeTransaction);

module.exports = router;