import { Schema } from 'mongoose';

export const ALaCarteWalksSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    titles: {
        type: [Object],
        required: true
    },
    descriptions: {
        type: [Object],
        required: true
    },
    pricePerPerson: {
        type: Number,
        required: false
    },
    duration: {
        type: Number,
        required: false
    },
    startLocation: {
        type: [Object],
        required: true
    },
    endLocation: {
        type: [Object],
        required: false
    },
    labels: {
        type: [String],
        ref: 'labels'
    },
    languages: {
        type: [String],
        ref: 'languages'
    },
    guides: {
        type: [String],
        ref: 'guides'
    },
    profilePicture: {
        type: String,
        ref: 'filedata'
    },
    images: {
        type: [String],
        ref: 'filedata'
    },
},{
    collection: 'aLaCarteWalks'
})

export const aLaCarteWalkValidator = {
    title: 'aLaCarteWalk',
    required: [
        'pricePerPerson',
        'duration',
        'startLocation'
    ],
    properties: {
        pricePerPerson: {
            bsonType: "number",
            description: "Price per person of an a la carte walk may not be empty"
        },
        duration: {
            bsonType: "number",
            description: "Duration of an a la carte walk may not be empty"
        },
        startLocation: {
            bsonType: "Object",
            description: "Start location of an a la carte walk may not be empty"
        }
    }
}