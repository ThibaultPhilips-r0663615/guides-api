import addAddress from './addAddress.endpoint';
import getAddress from './getAddresses.endpoint';
import getAddresses from './getAddress.endpoint';
import updateAddress from './updateAddress.endpoint';
import deleteAddress from './deleteAddress.endpoint';
import { Application } from 'express';

export default (app: Application) => {
    addAddress(app);
    getAddress(app);
    getAddresses(app);
    updateAddress(app);
    deleteAddress(app);
};