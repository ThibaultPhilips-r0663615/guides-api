import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';

import firebaseConfig from '../../config/firebase.config';

import * as firebaseApp from 'firebase/app'

import * as firebaseAuth from 'firebase/auth';
import { ExternalApiError } from '../../error/model/errors.external';

class TSignInWithEmailAndPasswordResult {
    user: {
        uid: string,
        email: string,
        emailVerified: Boolean,
        providerData: [
            {
                providerId: string,
                uid: string,
                displayName: string,
                email: string,
                phoneNumber: string,
                photoURL: string
            }
        ],
        refreshToken: string,
        accessToken: string,
        expirationTime: Number
        createdAt: string,
        lastLoginAt: string,
        expiresIn: string
    }
    _tokenResponse: {
        email: string,
        displayName: string,
        idToken: string,
        registered: Boolean,
        refreshToken: string,
    }
}

const firebase = firebaseApp.initializeApp(firebaseConfig as firebaseApp.FirebaseOptions);
const auth = firebaseAuth.getAuth(firebase);

export default async (app: Application) => {
    app.post('/login', async (request: Request, response: Response, next: NextFunction) => {
        try {
            //firebaseAuth.connectAuthEmulator(auth, `${process.env.FIREBASE_AUTH_EMULATOR}`)
            firebaseAuth.signInWithEmailAndPassword(auth, request.body.email, request.body.password)
                .then((res: any) => {
                    //console.log(res);
                    let data = {
                        uid: res.user?.uid,
                        email: res.user?.email,
                        emailVerified: res.user?.emailVerified,
                        isAnonymous: res.user?.isAnonymous,
                        providerData: res.user?.providerData,
                        refreshToken: res.user?.stsTokenManager?.refreshToken,
                        accessToken: res.user?.stsTokenManager?.accessToken,
                        expirationTime: res.user?.stsTokenManager?.expirationTime,
                        expiresIn: res._tokenResponse?.expiresIn,
                        createdAt: res.user?.createdAt,
                        lastLoginAt: res.user?.lastLoginAt
                    }
                    console.log(res);
                    // *TODO fix expire date for cookie
                    /*var t = new Date();
                    t.setSeconds(t.getSeconds() + res._tokenResponse.expires_in)
                    response.cookie('id_token', res._tokenResponse.idToken, { path: '/gidsen-4b554/europe-west1/api/login', httpOnly: true, expires: t, sameSite: 'none' });
                    response.cookie('refresh_token', res._tokenResponse.refreshToken, { httpOnly: true, expires: new Date(res.user.stsTokenManager.expirationTime), sameSite: 'none' });*/
                    response.status(StatusCodes.OK).json(data);
                    return;
                })
                .catch((error: any) => {
                    if (!!error.code) {
                        if (
                            error.code.toLowerCase() == firebaseAuth.AuthErrorCodes.INVALID_EMAIL.toLocaleLowerCase() ||
                            error.code.toLowerCase() == firebaseAuth.AuthErrorCodes.INVALID_PASSWORD.toLocaleLowerCase() ||
                            error.code.toLowerCase() == firebaseAuth.AuthErrorCodes.TOKEN_EXPIRED.toLocaleLowerCase() ||
                            error.code.toLowerCase() == firebaseAuth.AuthErrorCodes.USER_DELETED.toLocaleLowerCase() ||
                            error.code.toLowerCase() == firebaseAuth.AuthErrorCodes.NULL_USER.toLocaleLowerCase()
                        ) {
                            response.status(StatusCodes.UNAUTHORIZED).json(new ExternalApiError(error.code, StatusCodes.UNAUTHORIZED));
                        }
                        else {
                            response.status(StatusCodes.BAD_REQUEST).json(new ExternalApiError(error.code, StatusCodes.BAD_REQUEST));
                        }
                        return;
                    }
                    return next(new InternalServerError(error.message, error.stack));
                });
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};