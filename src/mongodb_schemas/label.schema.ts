import { Schema } from 'mongoose';

export const labelsSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    colorCode: {
        type: String,
        required: true
    },
    textColorCode: {
        type: String,
        required: true
    },
    texts: {
        type: [Object]
    }
},{
    collection: 'labels'
})