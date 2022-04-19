require('dotenv').config();
const sequelize = require('../database/db');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

module.exports = {
    getTransactions: async (req, res) => {
        const transactions = await Transaction.findAll({
            where: { userid: req.userId },
            attributes: ['id', 'name', 'value', 'date']
        })
        res.json({ transactions });
    },
    addTransaction: async (req, res) => {
        const { name, value, date} = req.body;

        if(!name || !value || !date) {
            return res.status(400).json({error: "Incomplete or invalid data"})
         }

        const newTransaction = await Transaction.create({
            name: name,
            value: value,
            date: date,
            userid: req.userId
        });
        return res.status(201).json({ newTransaction: newTransaction });
    },
    editTransaction: async (req, res) => {
        const { name, value, date } = req.body;
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

        if(name) { transaction.name = name }
        if(value) { transaction.value = value }
        if(date) { transaction.date = date }

        await transaction.save();

        res.json({ msg: "Successfully updated" })
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
        res.json({})
    }
}