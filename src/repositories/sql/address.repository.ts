import { Connection } from 'typeorm';
import { Address } from '../../model/address.model';
import { AddressRepository } from '../address.repository.interface';
import { getConnection } from '../database_sql.utils';

class AddressRepositorySQL implements AddressRepository {

    addAddress = async (newAddress: Address): Promise<Address | undefined> => {
        let connection: Connection = getConnection(undefined);
        let addressRepository = connection.getRepository(Address);
        return addressRepository.save(newAddress).then(async () => {
            return addressRepository.findOne(newAddress._id);
        })
    }

    updateAddress = async (updateAddress: Address): Promise<Address | undefined> => {
        let connection: Connection = getConnection(undefined);
        let addressRepository = connection.getRepository(Address);
        return addressRepository.save(updateAddress).then(async () => {
            return addressRepository.findOne(updateAddress._id);
        })
    }

    getAddress = async (id: string): Promise<Address | undefined> => {
        let connection: Connection = getConnection(undefined);
        let addressRepository = connection.getRepository(Address);
        return addressRepository.findOne(id);
    }

    getAddresses = async (): Promise<Address[] | undefined> => {
        let connection: Connection = getConnection(undefined);
        let addressRepository = connection.getRepository(Address);
        return addressRepository.find();
    }

    deleteAddress = async (id: string): Promise<Boolean> => {
        let connection: Connection = getConnection(undefined);
        let addressRepository = connection.getRepository(Address);
        let address: Address | undefined = await addressRepository.findOne(id);
        await addressRepository.remove(address!);
        return Promise.resolve(true);
    }
}

export { AddressRepositorySQL }