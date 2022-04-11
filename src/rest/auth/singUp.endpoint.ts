import { Request, Response, Application, NextFunction } from 'express';
import { InternalDataBaseError, InternalServerError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import * as admin from 'firebase-admin';
import { validate } from 'class-validator';
import { User } from '../../model/user.model';

export default async(app: Application) => {
    app.post('/sign-up', async (request: Request, response: Response, next: NextFunction) => {
        try {
            let newUser: User = new User(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
            validate(newUser).then(async (errors) => {
                try {
                    if (errors.length === 0) {
                        admin.auth().createUser({ email: newUser.email, password: newUser.password } as any)
                            .then(async (data: any) => {
                                await admin.auth().setCustomUserClaims(data.uid, { admin: true })
                                    .catch((error: any) => {
                                        return next(new InternalDataBaseError(error.message, error.stack));
                                    });
                                return response.status(StatusCodes.ACCEPTED).send(data);
                            })
                            .catch((error: any) => {
                                return next(new InternalDataBaseError(error.message, error.stack));
                            });
                    }
                    else {
                        response.status(StatusCodes.BAD_REQUEST).send(errors);
                        return;
                    }
                }
                catch (error: any) {
                    return next(new InternalServerError(error.message, error.stack));
                }
            })
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};