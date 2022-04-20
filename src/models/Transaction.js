const Sequelize = require('sequelize');
const database = require('../database/db')

const Transaction = database.define('transaction', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    value: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    userid: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},{
    tableName: 'transactions',
    timestamps: false
})

module.exports = Transaction;