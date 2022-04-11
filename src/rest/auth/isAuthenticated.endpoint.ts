import { Request, Response, Application } from 'express'
import { InternalServerError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { LoggingContext } from '../../error/service/logging.context';
import queryString from 'query-string'

export default async (app: Application) => {
    app.get('/is-authenticated', async(request: Request, response: Response, next: any) => {
        try {
            // ** https://firebase.google.com/docs/reference/rest/auth/#section-refresh-token
            let idToken;
            if (
                request.headers.authorization &&
                request.headers.authorization.startsWith('Bearer ')
            ) {
                idToken = request.headers.authorization.split('Bearer ')[1];
            } else {
                response.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized, no bearer token present.' });
            }

            admin
                .auth()
                .verifyIdToken(idToken as string)
                .then(async (decodedToken) => {
                    let getUser: any = await admin.auth().getUser(decodedToken.uid)
                    return response.status(StatusCodes.ACCEPTED).send(getUser);
                })
                .catch(async (error) => {
                    try {
                        let internalServerError: InternalServerError = new InternalServerError(error.message, error.stack);
                        LoggingContext.GetInstance().GetLoggingService().writeErrorToLog(internalServerError);
                        var t = new Date();
                        axios.post(`https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_CONFIG_APIKEY}`,
                            queryString.stringify({
                                refresh_token: `${request.headers.refresh_token}`,
                                grant_type: 'refresh_token'
                            }),
                            {
                                headers: { 'content-type': 'application/x-www-form-urlencoded' }
                            })
                            .then((result) => {
                                // *TODO fix expire date for cookie
                                t.setSeconds(t.getSeconds() + result.data.expires_in)
                                response.cookie('id_token', result.data.id_token, { httpOnly: true, expires: t });
                                response.cookie('refresh_token', result.data.refresh_token, { httpOnly: true, expires: new Date(253402300000000) });
                                response.status(StatusCodes.ACCEPTED).send(result.data);
                                return;
                            })
                            .catch((error) => {
                                response.cookie('id_token', '', { httpOnly: true, expires: new Date() });
                                response.cookie('refresh_token', '', { httpOnly: true, expires: new Date() });
                                return next(new InternalServerError(error.message, error.stack));
                            })
                    }
                    catch (error: any) {
                        return next(new InternalServerError(error.message, error.stack));
                    }
                });
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};