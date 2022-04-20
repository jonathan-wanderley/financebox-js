const { checkSchema } = require('express-validator');

module.exports = {
    add: checkSchema({
        name: {
            trim: true,
            isLength: {
                options: {
                    min: 2
                }
            },
            errorMessage: 'The transaction name must be at least 2 characters long'
        },
        value: {
            isCurrency: true,
            errorMessage: 'Enter a valid transaction amount'
        },
        date: {
            isDate: true,
            errorMessage: 'Type a valid date'
        }
    }),
    edit: checkSchema({
        name: {
            trim: true,
            isLength: {
                options: {
                    min: 2
                }
            },
            optional: {
                nullable: true
            },
            errorMessage: 'The transaction name must be at least 2 characters long'
        },
        value: {
            optional: {
                nullable: true
            },
            isCurrency: true,
            errorMessage: 'Enter a valid transaction amount'
        },
        date: {
            optional: {
                nullable: true
            },
            isDate: true,
            errorMessage: 'Type a valid date'
        }
    })
};