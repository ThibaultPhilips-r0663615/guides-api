import * as admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes';
import { InternalServerError } from '../error/model/errors.internal';

export const isAdmin = (request: Request, response: Response, next: NextFunction) => {
    try {
        let idToken;
        if (
            request.headers.authorization &&
            request.headers.authorization.startsWith('Bearer ')
        ) {
            idToken = request.headers.authorization.split('Bearer ')[1];
        } else {
            response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized, no bearer token present.' });
            return;
        }
        admin
            .auth()
            .verifyIdToken(idToken as string)
            .then(async (decodedToken) => {
                let user: any = await admin.auth().getUser(decodedToken.uid)
                if (user['customClaims']['admin']) {
                    request.body.user = user;
                    return next();
                }
                response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized, incorrect bearer token.' });
                return;
            })
            .catch((error) => {
                return next(new InternalServerError(error.message, error.stack));
            });
    }
    catch (error: any) {
        return next(new InternalServerError(error.message, error.stack));
    }
};