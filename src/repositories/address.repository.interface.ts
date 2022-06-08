import { Address } from './../model/address.model';

interface IAddressRepository {
    addAddress: (addAddress: Address) => Promise<Address | undefined>;
    updateAddress: (updateAddress: Address) => Promise<Address | undefined>;
    getAddress: (id: string) => Promise<Address | undefined>;
    getAddresses: () => Promise<Address[] | undefined>;
    deleteAddress: (id: string) => Promise<Boolean>;
}

export {IAddressRepository}