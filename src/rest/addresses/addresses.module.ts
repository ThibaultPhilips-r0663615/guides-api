/*export * from './addAddress.endpoint';
export * from './getAddresses.endpoint';
export * from './getAddress.endpoint';
export * from './updateAddress.endpoint';*/

module.exports = (app: any) => {
    require('./addAddress.endpoint')(app)
    require('./getAddress.endpoint')(app)
    require('./getAddresses.endpoint')(app)
    require('./updateAddress.endpoint')(app)
    require('./deleteAddress.endpoint')(app)
};