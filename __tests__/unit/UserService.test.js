const User = require('../../src/models/User');
const UserService = require('../../src/services/UserService');

describe('Testing user service', () => {
    
    let name = 'TesterName'
    let email = 'test@jest.com';
    let password = 'testing1234'
    
    beforeAll(async () => {
        await User.sync({ force: true});
    });

    it('should create a new user', async () => {
        const newUser = await UserService.createUser(name, email, password);
        expect(newUser).not.toBeInstanceOf(Error);
        expect(newUser).toHaveProperty('id');
        expect(newUser.email).toBe(email);
    });

    it('should not allow to create a user with existing email', async () => {
        const newUser = await UserService.createUser(name, email, password);
        expect(newUser).toBeInstanceOf(Error);
    });

    it('should find a user by the email', async () => {
        const user = await UserService.findByEmail(email);
        expect(user.email).toBe(email);
    });

    it('should match the password from database', async () => {
        const user = await UserService.findByEmail(email);
        const match = await UserService.matchPassword(password, user.password);
        expect(match).toBeTruthy();
    });

    it('should not match the password from database', async () => {
        const user = await UserService.findByEmail(email);
        const match = await UserService.matchPassword('invalid123', user.password);
        expect(match).toBeFalsy();
    });

    it('should get a list of users', async () => {
        const users = await UserService.all();
        expect(users.length).toBeGreaterThanOrEqual(1);
        for(let i in users) {
            expect(users[i]).toBeInstanceOf(User);
        }
    });

    it('should login a user', async () => {
        const loginResult = await UserService.loginUser(email, password);
        expect(loginResult).not.toBeInstanceOf(Error);
    });

    it('should not login a user', async () => {
        const loginResult = await UserService.loginUser('invalid3@mail.com', password);
        expect(loginResult).toBeInstanceOf(Error);
    });

    it('should generate a JWT token', async () => {
        const user = await UserService.findByEmail(email);
        const { id, name } = user;
        const token = await UserService.generateToken(id, name);
        expect(token).not.toBeInstanceOf(Error);
        expect(typeof token).toBe('string')
    });
})