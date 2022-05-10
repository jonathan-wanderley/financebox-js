const { validationResult, matchedData } = require('express-validator');
const TransactionService = require('../services/TransactionService');

const customValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            msg: error.msg
        }
    }
})

module.exports = {
    getTransactions: async (req, res) => {
        const { sort: queryOrder } = req.query
        const { userId, userName } = req;

        const transactions = await TransactionService.get(queryOrder, userId);
        
        res.json({
            user_name: userName,
            user_transactions: transactions
        });
    },
    addTransaction: async (req, res) => {
        const errors = customValidationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.mapped()});
        }

        const { name, value, date} = matchedData(req);
        const { userId } = req;

        const result = await TransactionService.add(name, value, date, userId);

        if(result instanceof Error) {
            const error = await JSON.parse(result.message);
            return res.status(400).json(error);
        }

        return res.status(201).json(result);
    },
    editTransaction: async (req, res) => {
        const errors = customValidationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.mapped()});
        }

        const { name, value, date } = matchedData(req);
        const { userId } = req;
        const { id: transactionId } = req.params;

        const result = await TransactionService.edit(transactionId, name, value, date, userId);

        if(result instanceof Error) {
            const error = await TransactionService.errorHandler(result.message);
            return res.status(error.code).json(error.msg);
        }

        return res.json(result);
    },
    removeTransaction: async (req, res) => {
        const { id: transactionId } = req.params;
        const { userId } = req;

        const result = await TransactionService.delete(transactionId, userId);

        if(result instanceof Error) {
            const error = await TransactionService.errorHandler(result.message);
            return res.status(error.code).json(error.msg);
        }

        res.json({ msg: "Successfully deleted" })
    }
}