const User = require('../../src/models/User');
const UserService = require('../../src/services/UserService');
const Transaction = require('../../src/models/Transaction');
const TransactionService = require('../../src/services/TransactionService');

describe('Testing transaction service', () => {
    
    let userId;
    let user;
    const userName = 'TransactionTester'
    const userEmail = 'transactions@jest.com';
    const userPassword = 'transaction123'

    let transactionId;
    const transactionName = 'shopping on amazon';
    const transactionValue = 398.90;
    const transactionDate = '2022-02-12 15:36:00';
    


    beforeAll(async () => {
        await User.sync({ force: true});
        await Transaction.sync({ force: true});
        user = await UserService.createUser(userName, userEmail, userPassword);
        userId = user.id;
    });

    it('should add a new transaction', async () => {
        const newTransaction = await TransactionService.add(transactionName, transactionValue, transactionDate, userId);
        const transactionObj = newTransaction.new_transaction
        expect(newTransaction).not.toBeInstanceOf(Error);
        expect(transactionObj).toHaveProperty('id');
        expect(transactionObj.value).toBe(transactionValue);
        transactionId = transactionObj.id;
    });

    it('should get a user transactions', async () => {
        const transactions = await TransactionService.get("DESC", userId);
        expect(transactions.length).toBeGreaterThanOrEqual(1);
        for(let i in transactions) {
            expect(transactions[i]).toBeInstanceOf(Transaction);
        }
    });

    it('should edit a transaction', async () => {
        const result = await TransactionService.edit(transactionId, transactionName, transactionValue, transactionDate, userId);

        expect(result).not.toBeInstanceOf(Error);
        expect(result).toHaveProperty("id");
    });

    it('should delete a transaction', async () => {
        const result = await TransactionService.delete(transactionId, userId);

        expect(result).not.toBeInstanceOf(Error);
        expect(result).toBeTruthy();
    });
})