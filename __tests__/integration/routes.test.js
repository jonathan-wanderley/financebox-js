const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Transaction = require('../../src/models/Transaction');

describe('Testing API routes', () => {
    
    const username = "Jorge";
    const email = "jorge_test@mail.com";
    const password = "jorge321"
    let token;
    let transactionId;

    beforeAll(async () => {
        await User.sync({ force: true });
        await Transaction.sync({ force: true });
    });

    it('POST /signup', (done) => {
        request(app).post('/signup')
            .send(`name=${username}&email=${email}&password=${password}`)
            .then(response => {
                expect(response.body.error).toBeUndefined();
                expect(response.body).toHaveProperty('id');
                expect(response.status).toBe(201);
                return done();
            })
    });

    it('POST /signin', (done) => {
        request(app).post('/signin')
            .send(`email=${email}&password=${password}`)
            .then(response => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.token).not.toBeNull;
                token = response.body.token;
                expect(response.status).toBe(200);
                return done();
            })
    });

    //Transactions

    it('POST /transactions', (done) => {
        request(app).post('/transactions')
            .send(`name=Gamer%20Keyboard&value=-350&date=2021-03-12%2012:33:00`)
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.body.error).toBeUndefined();
                expect(response.body).toHaveProperty('new_transaction');
                expect(response.status).toBe(201);
                transactionId = response.body.new_transaction.id;
                return done();
            })
    });

    it('GET /transactions', (done) => {
        request(app).get('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                const userTransactions = response.body.user_transactions;
                expect(userTransactions.length).toBeGreaterThanOrEqual(1);
                expect(response.status).toBe(200);
                return done();
            })
    });

    it('PUT /transactions/:id', (done) => {
        request(app).put(`/transactions/${transactionId}`)
            .send(`name=Kid%20Keyboard&value=-150&date=2022-05-22%2016:13:00`)
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.body.error).toBeUndefined();
                expect(response.body).toHaveProperty('id');
                expect(response.status).toBe(200);
                return done();
            })
    });

    it('DELETE /transactions/:id', (done) => {
        request(app).delete(`/transactions/${transactionId}`)
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.status).toBe(204);
                return done();
            })
    });
})