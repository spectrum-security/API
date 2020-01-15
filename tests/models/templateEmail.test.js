const mongoose = require('mongoose')
const TemplateEmailModel = require('../../models/templateEmail')
const config = require('../../config/testDb.config')

//test variable
const newTemplateEmail = {
    title: 'title', type: 1, content:'content'
}

describe('template email model test', () => {
    beforeAll(async () => {
        await mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    it('create & save template email successfully', async (done) => {
        const validTemplateEmail = new TemplateEmailModel(newTemplateEmail);
        const savedTemplateEmail = await validTemplateEmail.save();
        
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedTemplateEmail._id).toBeDefined();
        expect(savedTemplateEmail.title).toBe(newTemplateEmail.title);
        expect(savedTemplateEmail.type).toBe(newTemplateEmail.type);
        expect(savedTemplateEmail.content).toBe(newTemplateEmail.content);
        

        done()
    });

    it('create template Email without required field should failed', async () => {
        const templateEmailWithoutRequiredField = new TemplateEmailModel({ title: 'title'});
        let err;
        try {
            const savedTemplateEmailWithoutRequiredField = await templateEmailWithoutRequiredField.save();
            error = savedTemplateEmailWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.content).toBeDefined();
    });

})