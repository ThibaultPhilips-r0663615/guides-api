import {
    Length,
    IsNotEmpty,
    IsEmail,
    Matches
} from 'class-validator';

export class User {
    uid: string;

    @IsNotEmpty({
        always: true,
        message: 'Email of a user may not be empty'
    })
    @Length(3, 100, {
        always: true,
        message: 'Email of a user must be between 3 and 100 characters'
    })
    @IsEmail({}, {
        always: true,
        message: 'Email of a user must be a valid email'
    })
    email: String;

    @IsNotEmpty({
        always: true,
        message: 'password may not be empty'
    })
    @Length(8, 50, {
        always: true,
        message: 'password be between 8 and 50 characters'
    })
    @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/,
        { message: 'password must contain at least 8 characters, at least 1 number, at least 1 lowercase character (a-z), at least 1 uppercase character (A-Z) and only contains 0-9a-zA-Z' })
    password: String;

    constructor(email: string = '', password: string = '', uid: string = '') {
        this.uid = uid;
        this.email = email;
        this.password = password;
    }
}