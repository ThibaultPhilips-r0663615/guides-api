import { Schema } from 'mongoose';

export const LanguagesSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    locale: {
        type: String,
        required: true
    },
    languageCode: {
        type: String,
        required: true
    },
    isMainLanguage: {
        type: Boolean,
        required: true
    }
}, {
    collection: 'languages'
})