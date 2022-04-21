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
            matches: {
                options: [/^([0-9]{4})-([0-1][0-9])-([0-3][0-9])\s([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/]
            },
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
            matches: {
                options: [/^([0-9]{4})-([0-1][0-9])-([0-3][0-9])\s([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/]
            },
            errorMessage: 'Type a valid date'
        }
    })
};