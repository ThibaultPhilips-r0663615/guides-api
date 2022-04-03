import { StatusCodes } from 'http-status-codes';

export class ExternalBaseError {
    [key: string]: any
    id: string;
    message: string;
    date: Date;

    constructor(id: string, message: string, date: Date) {
        this.id = id;
        this.message = message;
        this.date = date;
    }
}

export class ExternalApiError extends ExternalBaseError {
    statusCode: number;

    constructor(id: string, message: string, date: Date, statusCode: StatusCodes) {
        super(id, message, date);
        this.statusCode = statusCode;
    }
}