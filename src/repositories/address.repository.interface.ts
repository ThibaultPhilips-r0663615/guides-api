import { Address } from './../model/address.model';

interface AddressRepository {
    addAddress: (addAddress: Address) => Promise<Address | undefined>;
    updateAddress: (updateAddress: Address) => Promise<Address | undefined>;
    getAddress: (id: string) => Promise<Address | undefined>;
    getAddresses: () => Promise<Address[] | undefined>;
    deleteAddress: (id: string) => Promise<Boolean>;
}

export {AddressRepository}