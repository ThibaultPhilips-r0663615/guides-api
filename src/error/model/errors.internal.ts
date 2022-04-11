import * as uuidv4 from 'uuid';

export class InternalBaseError extends Error {
    id: string;
    date: Date;
    name: string;
    errorStack: string;
    errorMessage: string;

    constructor(message: string, stack?: string) {
        super(message);
        this.id = uuidv4();
        this.name = InternalBaseError.name;
        this.date = (new Date()); 
        this.errorMessage = message;
        this.errorStack = stack ? stack : '';
        this.stack = stack;
    }
}

export class InternalDataBaseError extends InternalBaseError {
    constructor(message: string, stack?: string) {
        super(message, stack);
        this.name = InternalDataBaseError.name;
    }
}

export class IOError extends InternalBaseError {
    constructor(message: string, stack?: string) {
        super(message, stack);
        this.name = IOError.name;
    }
}

export class InternalServerError extends InternalBaseError {
    constructor(message: string, stack?: string) {
        super(message, stack);
        this.name = InternalServerError.name;
    }
}