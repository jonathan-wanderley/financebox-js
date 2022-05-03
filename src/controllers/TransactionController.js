require('dotenv').config();
const Transaction = require('../models/Transaction');
const { validationResult, matchedData } = require('express-validator');
const { v4: uuid } = require('uuid');

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
        let orderType;
        if(queryOrder && queryOrder.toLowerCase() == "asc") {
            orderType = "ASC";
        } else {
            orderType = "DESC";
        }

        const transactions = await Transaction.findAll({
            where: { userid: req.userId },
            attributes: ['id', 'name', 'value', 'date'],
            order: [ ['date', orderType] ]
        })
        
        res.json({
            user_name: req.userName,
            user_transactions: transactions
        });
    },
    addTransaction: async (req, res) => {
        const errors = customValidationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.mapped()});
        }

        const data = matchedData(req);
        const { name, value, date} = data;

        if(!name || !value || !date) {
            return res.status(400).json({error:{data:{ msg: "Incomplete or invalid data" }}});
         }

        const newTransaction = await Transaction.create({
            id: uuid(),
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
            return res.status(400).json({error:{id:{ msg: "Invalid id" }}});
        }

        const transaction = await Transaction.findByPk(id);
        if(!transaction) {
            return res.status(400).json({error:{id:{ msg:"Invalid id" }}});
        }
        if(transaction.userid != req.userId) {
            return res.status(401).json({notallowed: true});
        };

        if(!name && !value && !date) {
            return res.status(400).json({error:{data:{ msg: "You sent empty data" }}});
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
            return res.status(400).json({error:{id:{ msg:"Invalid id" }}});
        }

        const transaction = await Transaction.findByPk(id);
        if(!transaction) {
            return res.status(400).json({error:{id:{ msg:"Invalid id" }}});
        }
        if(transaction.userid != req.userId) {
            return res.status(401).json({notallowed: true});
        };

        await transaction.destroy();
        res.json({ msg: "Successfully deleted" })
    }
}