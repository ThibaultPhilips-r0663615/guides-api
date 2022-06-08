import * as admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes';
import { InternalServerError } from '../error/model/errors.internal';
import { ExternalApiError } from '../error/model/errors.external';

export const isAdmin = (request: Request, response: Response, next: NextFunction) => {
    try {
        let idToken;
        if (
            request.headers.authorization &&
            request.headers.authorization.startsWith('Bearer ')
        ) {
            idToken = request.headers.authorization.split('Bearer ')[1];
        } else {
            return response.status(StatusCodes.UNAUTHORIZED).json(new ExternalApiError('Unauthorized, no bearer token present.', StatusCodes.UNAUTHORIZED));
        }
        admin
            .auth()
            .verifyIdToken(idToken as string)
            .then(async (decodedToken) => {
                let user: any = await admin.auth().getUser(decodedToken.uid)
                if (user) {
                    request.body.user = user;
                    return next();
                }
                return response.status(StatusCodes.UNAUTHORIZED).json(new ExternalApiError('Unauthorized, incorrect bearer token.', StatusCodes.UNAUTHORIZED));
            })
            .catch((error) => {
                return next(new InternalServerError(error.message, error.stack));
            });
    }
    catch (error: any) {
        return next(new InternalServerError(error.message, error.stack));
    }
};