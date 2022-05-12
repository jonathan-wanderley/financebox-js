const UserService = require('../services/UserService');
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

        const { email, password } = matchedData(req);

        const loginResult = await UserService.loginUser(email, password);

        if(loginResult instanceof Error) {
            const error = await JSON.parse(loginResult.message)
            res.status(401).json(error)
        }

        return res.json({ token: loginResult });
    },
    signup: async (req, res) => {
        const errors = customValidationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.mapped()}); 
        }
        const { name, email, password } = matchedData(req);

        const result = await UserService.createUser(name, email, password);
        
        if(result instanceof Error) {
            const error = await JSON.parse(result.message);
            return res.status(400).json(error);
        }

        return res.status(201).json(result);
    }
}