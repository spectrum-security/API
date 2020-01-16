const mongoose = require('mongoose')
const SensorModel = require('../../models/sensor')
const config = require('../../config/testDb.config')

//test variable
const newSensor = {
    companyId: '5e1e0ca61c9d440000d04531', location: 'location',sensorType:2,
    maintenance: [{ date: '', report: 'fail'}], active: true
}

describe('sensor model test', () => {
    beforeAll(async () => {
        await mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    it('create & save sensor successfully', async (done) => {
        const validSensor = new SensorModel(newSensor);
        const savedSensor = await validSensor.save();
        
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedSensor._id).toBeDefined();
        expect(savedSensor.location).toBe(newSensor.location);
        expect(savedSensor.sensorType).toBe(newSensor.sensorType);
        expect(savedSensor.active).toBe(newSensor.active);

        done()
    });

    it('create sensor without required field should failed', async () => {
        const sensorWithoutRequiredField = new SensorModel({ location: 'location'});
        let err;
        try {
            const savedSensorWithoutRequiredField = await sensorWithoutRequiredField.save();
            error = savedSensorWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        // expect(err.errors.email).toBeDefined();
    });

})