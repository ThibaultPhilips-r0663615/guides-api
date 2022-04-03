interface IAddress {
    _id: String;
    streetName?: String;
    houseNumber?: String;
    cityName: String;
    postcode: String;
    description?: String;
}

export { IAddress }