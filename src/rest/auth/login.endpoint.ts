import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';

import firebaseConfig from '../../config/firebase.config';

import * as firebaseApp from 'firebase/app'

import * as firebaseAuth from  'firebase/auth';

const firebase = firebaseApp.initializeApp(firebaseConfig as firebaseApp.FirebaseOptions);
const auth = firebaseAuth.getAuth(firebase);

export default async (app: Application) => {
    app.post('/login', async (request: Request, response: Response, next: NextFunction) => {
        try {
            firebaseAuth.connectAuthEmulator(auth, `${process.env.FIREBASE_AUTH_EMULATOR}`)
            firebaseAuth.signInWithEmailAndPassword(auth, request.body.email, request.body.password)
                .then((res) => {
                    response.status(StatusCodes.ACCEPTED).json(res);
                })
                .catch((error: any) => {
                    return next(new InternalServerError(error.message, error.stack));
                });
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};