import { Schema } from 'mongoose';
import { IAddress } from '../model/interfaces/address.interface';

export const AddressesSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    streetName: {
        type: String,
        required: function (this: IAddress) {
            if (this.description !== undefined)
                return false;

            return true;
        }
    },
    houseNumber: {
        type: String,
        required: function (this: IAddress) {
            if (this.description !== undefined)
                return false;

            return true;
        }
    },
    cityName: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
    description: {
        type: [String]
    }
}, {
    collection: 'addresses'
})