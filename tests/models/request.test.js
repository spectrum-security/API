const mongoose = require('mongoose')
const RequesModel = require('../../models/request')
const config = require('../../config/testDb.config')

//test variable
const newRequest = {
    companyId: '5e1e0ca61c9d440000d04531', date: '11-11-2019', finished: false
}

describe('request model test', () => {
    beforeAll(async () => {
        await mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    // beforeEach(async () => {
    //     await RequesModel.deleteMany({});
    // });


    it('create & save request successfully', async (done) => {
        const validRequest = new RequesModel(newRequest);
        const savedRequest = await validRequest.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedRequest._id).toBeDefined();
        expect(savedRequest.date).toStrictEqual(new Date('11-11-2019'));
        expect(savedRequest.finished).toBe(newRequest.finished);

        done()
    });

    
    it('create request without required field should failed', async () => {
        const requestWithoutRequiredField = new RequesModel({ companyId: '5e1e0ca61c9d440000d04531' });
        let err;
        try {
            const savedRequestWithoutRequiredField = await requestWithoutRequiredField.save();
            error = savedRequestWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.date).toBeDefined();
    });

})