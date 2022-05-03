const { checkSchema } = require('express-validator');

module.exports = {
    signup: checkSchema({
        name: {
            trim: true,
            matches: {
                options: [/^[A-Za-z]+$/],
                errorMessage: "Invalid name, only letters are allowed"
            },
            isLength: {
                options: {
                    min: 2
                }
            },
            errorMessage: 'Invalid name, only letters are allowed'
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'Invalid email'
        },
        password: {
            isLength: {
                options: { min: 4 }
            },
            errorMessage: 'Password must be at least 4 characters'
        }
    }),
    signin: checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'Invalid email'
        },
        password: {
            isLength: {
                options: { min: 4 }
            },
            errorMessage: 'Password must be at least 4 characters'
        }
    })
};