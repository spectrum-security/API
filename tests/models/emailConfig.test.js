const mongoose = require('mongoose')
const EmailConfigModel = require('../../models/emailConfig')
const config = require('../../config/testDb.config')

//test variable
const newEmailConfig = {
    user: 'user', password: '123456', host:'host', port: 300,
    tls: true
}

describe('company model test', () => {
    beforeAll(async () => {
        await mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    //ERRO Base64
    it('create & save email  successfully', async (done) => {
        const validEmailConfig = new EmailConfigModel(newEmailConfig);
        const savedEmailConfig = await validEmailConfig.save();
        
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedEmailConfig._id).toBeDefined();
        // expect(savedEmailConfig.user).toBe(newEmailConfig.user);
        // expect(savedEmailConfig.host).toBe(newEmailConfig.host);
        // expect(savedEmailConfig.port).toBe(newEmailConfig.port);
        // expect(savedEmailConfig.tls).toBe(newEmailConfig.tls);

        done()
    });

    // it('create company without required field should failed', async () => {
    //     const companyWithoutRequiredField = new CompanyModel({ name: 'name'});
    //     let err;
    //     try {
    //         const savedCompanyWithoutRequiredField = await companyWithoutRequiredField.save();
    //         error = savedCompanyWithoutRequiredField;
    //     } catch (error) {
    //         err = error
    //     }
    //     expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    //     // expect(err.errors.email).toBeDefined();
    // });

})