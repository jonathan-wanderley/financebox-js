require('dotenv').config();
const Transaction = require('../models/Transaction');
const { validationResult, matchedData } = require('express-validator');

const customValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            msg: error.msg
        }
    }
})

module.exports = {
    getTransactions: async (req, res) => {
        const transactions = await Transaction.findAll({
            where: { userid: req.userId },
            attributes: ['id', 'name', 'value', 'date']
        })
        res.json({ your_transactions: transactions });
    },
    addTransaction: async (req, res) => {
        const errors = customValidationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.mapped()});
        }

        const data = matchedData(req);
        const { name, value, date} = data;

        if(!name || !value || !date) {
            return res.status(400).json({error: "Incomplete or invalid data"})
         }

        const newTransaction = await Transaction.create({
            name: name,
            value: value,
            date: date,
            userid: req.userId
        });
        return res.status(201).json({
            new_transaction: {
                id: newTransaction.id,
                name: newTransaction.name,
                value: newTransaction.value,
                date: newTransaction.date
            }
        });
    },
    editTransaction: async (req, res) => {
        const errors = customValidationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.mapped()});
        }

        const data = matchedData(req);
        const { name, value, date } = data;
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({error: "Invalid id"});
        }

        const transaction = await Transaction.findByPk(id);
        if(!transaction) {
            return res.status(400).json({error: "Invalid id"});
        }
        if(transaction.userid != req.userId) {
            return res.status(401).json({error: "You are not allowed to change this transaction"});
        };

        if(!name && !value && !date) {
            return res.status(400).json({error: "You sent empty data"});
        }

        if(name) { transaction.name = name }
        if(value) { transaction.value = value }
        if(date) { transaction.date = date }

        await transaction.save();

        return res.json({ msg: "Successfully updated" })
    },
    removeTransaction: async (req, res) => {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({error: "Invalid id"});
        }

        const transaction = await Transaction.findByPk(id);
        if(!transaction) {
            return res.status(400).json({error: "Invalid id"});
        }
        if(transaction.userid != req.userId) {
            return res.status(401).json({error: "You are not allowed to delete this transaction"});
        };

        await transaction.destroy();
        res.json({ msg: "Successfully deleted" })
    }
}