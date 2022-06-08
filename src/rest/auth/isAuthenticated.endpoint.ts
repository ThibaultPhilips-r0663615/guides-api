import { Request, Response, Application } from 'express'
import { InternalServerError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import queryString from 'query-string'
import { ExternalApiError } from '../../error/model/errors.external';

export default async (app: Application) => {
    app.get('/is-authenticated', async (request: Request, response: Response, next: any) => {
        try {
            // ** https://firebase.google.com/docs/reference/rest/auth/#section-refresh-token
            let accessToken;
            if (
                request.headers.authorization &&
                request.headers.authorization.startsWith('Bearer ')
            ) {
                accessToken = request.headers.authorization.split('Bearer ')[1];
            } else {
                return response.status(StatusCodes.UNAUTHORIZED).json(new ExternalApiError('Unauthorized, no bearer token present.', StatusCodes.UNAUTHORIZED));
            }

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
                    let data = result.data as { access_token: string, expires_in: string, token_type: string, refresh_token: string, id_token: string, user_id: string, project_id: string }

                    t.setSeconds(t.getSeconds() + Number(data.expires_in));
                    response.cookie('access_token', data.access_token, { httpOnly: true, expires: t, sameSite: 'none', secure: true });
                    response.cookie('refresh_token', data.refresh_token, { httpOnly: true, expires: new Date(253402300000000), sameSite: 'none', secure: true });
                    response.status(StatusCodes.OK).json({
                        access_token: data.access_token,
                        refresh_token: data.refresh_token,
                        user_id: data.user_id
                    });
                    return;
                })
                .catch((error) => {
                    response.cookie('access_token', '', { httpOnly: true, expires: new Date(), sameSite: 'none', secure: true });
                    response.cookie('refresh_token', '', { httpOnly: true, expires: new Date(), sameSite: 'none', secure: true });
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        if (!!error.response.data) {
                            if (
                                error.response.data.message == 'TOKEN_EXPIRED' ||
                                error.response.data.message == 'INVALID_REFRESH_TOKEN' ||
                                error.response.data.message == 'MISSING_REFRESH_TOKEN' || 
                                error.response.data.message == 'USER_NOT_FOUND'
                            ) {
                                response.status(StatusCodes.UNAUTHORIZED).json(new ExternalApiError(error.code, StatusCodes.UNAUTHORIZED));
                            }
                            else if(
                                error.response.data.message == 'INVALID_GRANT_TYPE' ||
                                error.response.data.message == 'USER_DISABLED'
                            ) {
                                response.status(StatusCodes.FORBIDDEN).json(new ExternalApiError(error.code, StatusCodes.FORBIDDEN));
                            }
                            else {
                                response.status(StatusCodes.BAD_REQUEST).json(new ExternalApiError(error.code, StatusCodes.BAD_REQUEST));
                            }
                            return;
                        }
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        return next(new InternalServerError(error.request, error));
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        return next(new InternalServerError(error.message, error.stack));
                    }
                })
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};