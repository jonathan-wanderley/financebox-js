const Transaction = require('../models/Transaction');

module.exports = {
    getTransactions: async (req, res) => {
        //Developing 
        const transactions = await Transaction.findAll();
        res.json({ transactions });
    },
    addTransaction: async (req, res) => {
        //Developing
        const { name, value, date, userid } = req.body;

        if(!name || !value || !date || !userid) {
            return res.status(400).json({error: "Incomplete or invalid data"})
         }

        const newTransaction = await Transaction.create({
            name: name,
            value: value,
            date: date,
            userid: userid
        });
        return res.status(201).json({ newTransaction: newTransaction });
    },
    editTransaction: (req, res) => {
        console.log('test');
    },
    removeTransaction: (req, res) => {
        console.log('test');
    }
}