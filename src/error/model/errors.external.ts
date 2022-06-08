import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

export class ExternalBaseError {
    [key: string]: any
    id: string;
    message: string;
    date: Date;

    constructor(message: string) {
        this.id = uuidv4();
        this.date = (new Date()); 
        this.message = message;
    }
}

export class ExternalApiError extends ExternalBaseError {
    statusCode: number;

    constructor(message: string, statusCode: StatusCodes) {
        super(message);
        this.statusCode = statusCode;
    }
}