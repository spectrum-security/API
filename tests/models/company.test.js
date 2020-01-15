const mongoose = require('mongoose')
const CompanyModel = require('../../models/company')
const config = require('../../config/testDb.config')

//test variable
const newCompany = {
    name: 'name', mainAdmin: '5e1e0ca61c9d440000d04531', phoneContacts: { main: 123, others: [123456789, 123] },
    points: 1, offices: [{ location: 'local', postalCode: 'zip' }], paymentMethod: 2
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

    it('create & save company successfully', async (done) => {
        const validCompany = new CompanyModel(newCompany);
        const savedCompany = await validCompany.save();
        
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedCompany._id).toBeDefined();
        expect(savedCompany.phoneContacts.main).toBe(newCompany.phoneContacts.main);
        expect(savedCompany.phoneContacts.others).toStrictEqual(expect.arrayContaining(newCompany.phoneContacts.others));
        expect(savedCompany.points).toBe(newCompany.points);
        expect(savedCompany.offices.location).toBe(newCompany.offices.location);
        expect(savedCompany.offices.postalCode).toBe(newCompany.offices.postalCode);
        expect(savedCompany.paymentMethod).toBe(newCompany.paymentMethod);

        done()
    });

    it('create company without required field should failed', async () => {
        const companyWithoutRequiredField = new CompanyModel({ name: 'name'});
        let err;
        try {
            const savedCompanyWithoutRequiredField = await companyWithoutRequiredField.save();
            error = savedCompanyWithoutRequiredField;
        } catch (error) {
            err = error
            
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.mainAdmin).toBeDefined();
    });

})