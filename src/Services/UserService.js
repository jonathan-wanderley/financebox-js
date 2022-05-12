require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async findByEmail(email) { 
        return await User.findOne({ where: { email: email }});
    },
    async matchPassword(passwordText, encrypted) {
        return await bcrypt.compare(passwordText, encrypted);
    },
    async generateToken(id, name) {
        return jwt.sign({
            id: id,
            name: name
        },
        process.env.JWT_SECRET, { expiresIn: '3d' });
    },
    async createUser(name, email, password) {
        const hasUser = await User.findOne({ where: { email: email }});
        if(hasUser) {
            const error = JSON.stringify({error:{email:{ msg:"This email is already registered" }}})
            return new Error(error);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name,
            email: email,
            password: passwordHash
        });

        const token = await this.generateToken(newUser.id, newUser.name);
        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            token
        };
    },
    async loginUser(email, password) {
        const hasUser = await this.findByEmail(email);

        if(!hasUser) {
            const error = JSON.stringify({error:{login:{ msg:"Incorrect email and/or password"}}})
            return new Error(error);
        }

        const isValidPassword = this.matchPassword(password, hasUser.password);
        if(!isValidPassword) {
            const error = JSON.stringify({error:{login:{ msg:"Incorrect email and/or password"}}})
            return new Error(error);
        }

        const token = await this.generateToken(hasUser.id, hasUser.name);
        
        return token;
    },
    async all() {
        return await User.findAll();
    }
}