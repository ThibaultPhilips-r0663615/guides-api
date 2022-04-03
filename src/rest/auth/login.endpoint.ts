import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';

const { firebaseConfig } = require('../../config/firebase.config')

const { initializeApp } = require('firebase/app');
import { getAuth, signInWithEmailAndPassword, connectAuthEmulator } from 'firebase/auth';
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);

module.exports = async function loginAPI(app: Application) {
    app.post('/login', async function loginAPIEndpoint(request: Request, response: Response, next: NextFunction) {
        try {
            connectAuthEmulator(auth, `${process.env.FIREBASE_AUTH_EMULATOR}`)
            signInWithEmailAndPassword(auth, request.body.email, request.body.password)
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