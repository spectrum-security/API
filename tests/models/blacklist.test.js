const mongoose = require('mongoose')
const BlacklistModel = require('../../models/blacklist')
const config = require('../../config/testDb.config')

//test variable
const newBlacklist = {
    hostname: 'unique name'
}

describe('blacklist model test', () => {
    beforeAll(async () => {
        await mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    beforeEach(async () => {
        await BlacklistModel.deleteMany({});
    });


    it('create & save blacklist successfully', async (done) => {
        const validBlacklist = new BlacklistModel(newBlacklist);
        const savedBlacklist = await validBlacklist.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedBlacklist._id).toBeDefined();
        expect(savedBlacklist.hostname).toBe(newBlacklist.hostname);

        done()
    });
})