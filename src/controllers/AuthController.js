require('dotenv').config();

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    signin: async (req, res) => {
        const { email, password } = req.body;

        const userFoundByEmail = await User.findOne({email: email});
        if(!userFoundByEmail) {
            return res.status(409).json({error:{email:{ msg:"Incorrect email and/or password"}}});
        }

        const isValidPassword = await bcrypt.compare(password, userFoundByEmail.password);
        if(!isValidPassword) {
            return res.status(409).json({error:{email:{ msg:"Incorrect email and/or password"}}});
        }

        const token = jwt.sign({ id: userFoundByEmail.id }, process.env.JWT_SECRET);

        res.json({ token });
    },
    signup: async (req, res) => {
        const { name, email, password } = req.body;

        const userFoundByEmail = await User.findOne({ where: { email: email } });
        if(userFoundByEmail) {
            return res.status(409).json({error:{email:{ msg:"This user is already registered" }}});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name,
            email: email,
            password: passwordHash
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);

        res.status(201).json({ token });
    }
}