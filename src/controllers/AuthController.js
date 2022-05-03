require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult, matchedData } = require('express-validator');

const customValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            msg: error.msg
        }
    }
})

module.exports = {
    signin: async (req, res) => {
        const errors = customValidationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.mapped()});
        }

        const data = matchedData(req);
        const { email, password } = data;

        const userFoundByEmail = await User.findOne({where: { email: email }});
        if(!userFoundByEmail) {
            return res.status(401).json({error:{login:{ msg:"Incorrect email and/or password"}}});
        }

        const isValidPassword = await bcrypt.compare(password, userFoundByEmail.password);
        if(!isValidPassword) {
            return res.status(401).json({error:{login:{ msg:"Incorrect email and/or password"}}});
        }

        const token = jwt.sign({
            id: userFoundByEmail.id,
            name: userFoundByEmail.name
        }, process.env.JWT_SECRET,{ expiresIn: '3d' });

        res.json({ token });
    },
    signup: async (req, res) => {

        const errors = customValidationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.mapped()}); 
        }

        const data = matchedData(req);
        const { name, email, password } = data;

        const userFoundByEmail = await User.findOne({ where: { email: email } });
        if(userFoundByEmail) {
            return res.status(400).json({error:{email:{ msg:"This user is already registered" }}});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name,
            email: email,
            password: passwordHash
        });

        const token = jwt.sign({
            id: newUser.id,
            name: newUser.name
        }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.status(201).json({ token });
    }
}