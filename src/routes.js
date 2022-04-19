const express = require('express');
const AuthController = require('./controllers/AuthController');
const router = express.Router();
const TransactionController = require('./controllers/TransactionController');
const Auth = require('./middlewares/Auth');

//Auth routes
router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);

//Transactions
router.get('/transactions', Auth.private, TransactionController.getTransactions);

router.post('/transactions', Auth.private, TransactionController.addTransaction);

router.put('/transactions/:id', Auth.private, TransactionController.editTransaction);

router.delete('/transactions/:id', Auth.private, TransactionController.removeTransaction);

module.exports = router;