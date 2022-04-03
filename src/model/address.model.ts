import { Length, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn } from "typeorm";
import { IAddress } from './interfaces/address.interface';

@Entity('addresses')
export class Address implements IAddress {
    @IsNotEmpty({
        always: true,
        message: 'ID of an address may not be empty'
    })
    @PrimaryColumn({ type: 'varchar', length: 50 })
    _id: string;

    @Length(0, 100, {
        always: true,
        message: 'Street name of an address must be between 1 and 100 characters'
    })
    @Column({ type: 'varchar', length: 100 })
    streetName: String;
    
    @Length(0, 50, {
        always: true,
        message: 'House number of an address must be less than 50 characters'
    })
    @Column({ type: 'varchar', length: 50 })
    houseNumber: String;

    @IsNotEmpty({
        always: true,
        message: 'City name of an address may not be empty'
    })
    @Length(1, 100, {
        always: true,
        message: 'City name of an address must be between 1 and 100 characters'
    })
    @Column({ type: 'varchar', length: 100 })
    cityName: String;

    @IsNotEmpty({
        always: true,
        message: 'Postcode of an address may not be empty'
    })
    @Length(1, 20, {
        always: true,
        message: 'Postcode of an address must be between 1 and 20 characters'
    })
    @Column({ type: 'varchar', length: 20 })
    postcode: String;

    @Length(0, 20, {
        always: true,
        message: 'Description of an address must be between 0 and 500 characters'
    })
    @Column({ type: 'varchar', length: 20 })
    description: String;



    constructor(_id: string, streetName: String, houseNumber: String, cityName: String, postcode: String, description: String) {
        this._id = _id;
        this.streetName = streetName;
        this.houseNumber = houseNumber;
        this.cityName = cityName;
        this.postcode = postcode;
        this.description = description;
    }
}