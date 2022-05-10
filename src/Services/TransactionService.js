const Transaction = require('../models/Transaction');
const { v4: uuid } = require('uuid');

module.exports = {
    async get (queryOrder, userId) {
        let orderType;
        
        if(queryOrder && queryOrder.toLowerCase() == "asc") {
            orderType = "ASC";
        } else {
            orderType = "DESC";
        }

        const transactions = await Transaction.findAll({
            where: { userid: userId},
            attributes: ['id', 'name', 'value', 'date'],
            order: [ ['date', orderType] ]
        })

        return transactions;
    },
    async add (name, value, date, userId) {
        if(!name || !value || !date) {
            const error = JSON.stringify({ error:{data:{ msg: "Incomplete or invalid data" }}});
            return new Error(error);
        }

        const newTransaction = await Transaction.create({
            id: uuid(),
            name: name,
            value: value,
            date: date,
            userid: userId
        });

        const transactionObj = {
            id: newTransaction.id,
            name: newTransaction.name,
            value: newTransaction.value,
            date: newTransaction.date
        }

        return { new_transaction: transactionObj }
    },
    async edit (transactionId, name, value, date, userId) {
        if(!transactionId) {
            const error = JSON.stringify({
                code: 400,
                error: {id:{ msg:"Invalid id" }}
            })
            return new Error(error);
        }

        const transaction = await Transaction.findByPk(transactionId);
        if(!transaction) {
            const error = JSON.stringify({
                code: 400,
                error: {id:{ msg:"Invalid id" }}
            })
            return new Error(error);
        }
        if(transaction.userid != userId) {
            const error = JSON.stringify({
                code: 401,
                notallowed: true
            })
            return new Error(error);
        };

        if(!name && !value && !date) {
            const error = JSON.stringify({
                code: 400,
                error:{data:{ msg: "You sent empty data" }}
            })
            return new Error(error);
        }

        if(name) { transaction.name = name }
        if(value) { transaction.value = value }
        if(date) { transaction.date = date }

        await transaction.save();
        return { msg: "Successfully updated" }
    },
    async delete (transactionId, userId) {
        if(!transactionId) {
            const error = JSON.stringify({
                code: 400,
                error:{id:{ msg:"Invalid id" }}
            });
            return new Error(error);
        }

        const transaction = await Transaction.findByPk(transactionId);
        if(!transaction) {
            const error = JSON.stringify({
                code: 400,
                error:{id:{ msg:"Invalid id" }}
            })
            return new Error(error);
        }
        if(transaction.userid != userId) {
            const error = JSON.stringify({
                code: 401,
                notallowed: true
            })
            return new Error(error);
        };

        await transaction.destroy();

        return true;
    },
    async errorHandler(errorTxt) {
        const errorParsed = await JSON.parse(errorTxt);
        const { code, error: specifiedError, notallowed } = errorParsed;

        let errorMsg;

        if(specifiedError) {
            errorMsg = { error: specifiedError }
        } else {
            errorMsg = { notallowed: notallowed }
        }

        return {
            code: code,
            msg: errorMsg
        }
    }
}