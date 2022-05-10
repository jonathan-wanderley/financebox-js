require('dotenv').config();
const Sequelize = require('sequelize');
const db = require('./database');

const sequelize = new Sequelize(
    db.db,
    db.user,
    db.password,
    {
        dialect: 'mysql',
        host: db.host,
        port: parseInt(db.port)
    }
);

module.exports = sequelize;