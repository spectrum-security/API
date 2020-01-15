const mongoose = require('mongoose')
const UserModel = require('../../models/user')
const config = require('../../config/testDb.config')

//test variable
const newUser = {
    name: { first: 'firstname', last: 'lastname' },
    userType: 1, email: 'fl@mail.com', password: '123456',
    companyId: '5e1e0ca61c9d440000d04531'
}

describe('user model test', () => {
    beforeAll(async () => {
        await mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    beforeEach(async () => {
        await UserModel.deleteMany({});
      });

    it('create & save user successfully', async () => {
        const validUser = new UserModel(newUser);
        const savedUser = await validUser.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name.first).toBe(newUser.name.first);
        expect(savedUser.name.last).toBe(newUser.name.last);
        expect(savedUser.email).toBe(newUser.email);
    });

    it('create user without required field should failed', async () => {
        const userWithoutRequiredField = new UserModel({ name: {first: 'firstname', last: 'lastname'}});
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            error = savedUserWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.email).toBeDefined();
    });

})