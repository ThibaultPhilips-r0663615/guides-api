import { Address } from '../../model/address.model';
import { AddressRepository } from '../address.repository.interface';
import mongoose from 'mongoose';
import { AddressesSchema } from '../../mongodb_schemas/address.schema';
import { InternalDataBaseError } from '../../error/model/errors.internal';
import uuidv4 from 'uuid'

class AddressRepositoryMongoDB implements AddressRepository {
    addressModel: mongoose.Model<any, {}, {}, {}>;
    constructor() {
        this.addressModel = mongoose.model('addresses', AddressesSchema)
    }

    addAddress = async (newAddress: Address): Promise<Address | undefined> => {
        const address = new this.addressModel({
            _id: newAddress._id === undefined ? uuidv4() : newAddress._id,
            streetName: newAddress.streetName,
            houseNumber: newAddress.houseNumber,
            cityName: newAddress.cityName,
            postcode: newAddress.postcode,
            description: newAddress.description
        });
        return address.save();
    }

    updateAddress = async (updateAddress: Address): Promise<Address | undefined> => {
        return this.addressModel.findOneAndUpdate({ '_id': updateAddress._id }, updateAddress, { new: true }).exec()
    }

    getAddress = async (id: string): Promise<Address | undefined> => {
        return this.addressModel.findOne({ '_id': id }).exec();
    }

    getAddresses = async (): Promise<Address[] | undefined> => {
        return this.addressModel.find().exec();
    }

    deleteAddress = async (id: string): Promise<Boolean> => {

        let result: any = await this.addressModel.deleteOne({ '_id': id }).exec().catch((err) => {
            Promise.reject(err)
        });
        return new Promise<Boolean>((resolve, reject) => {
            if (result?.deletedCount > 0)
                resolve(true);
            if (result === undefined)
                reject(new InternalDataBaseError('No address was found with the given id', new Error().stack))

            // ** no filedata was deleted
            resolve(false);
        });
    }
}

export {AddressRepositoryMongoDB}