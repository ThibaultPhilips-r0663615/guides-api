import { Schema } from 'mongoose';

interface Address {
    _id: String;
    firstName: String;
    lastName: String;
    nickName?: String;
    email?: String;
    phoneNumber?: String;
    languages?: String[];
}

export const GuidesSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: function (this: Address) {
            if (this.phoneNumber !== undefined)
                return false;

            return true;
        }
    },
    phoneNumber: {
        type: String,
        required: function (this: Address) {
            if (this.email !== undefined)
                return false;

            return true;
        }
    },
    languages: {
        type: [String],
        ref: 'languages'
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
    collection: 'guides'
})

export const guideValidator = {
    title: 'guide',
    required: [
        'firstName',
        'lastName',
        'nickName',
        'email',
        'phoneNumber'
    ],
    properties: {
        firstName: {
            bsonType: "string",
            description: "First name of a guide may not be empty"
        },
        lastName: {
            bsonType: "string",
            description: "Last name of a guide may not be empty"
        },
        nickName: {
            bsonType: "string",
            description: "Locale of a language may not be empty"
        },
        email: {
            bsonType: "string",
            description: "Email of a guide may not be empty"
        },
        phoneNumber: {
            bsonType: "string",
            description: "Phone number of a guide may not be empty"
        }
    }
}