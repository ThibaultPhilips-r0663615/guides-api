
//import * as admin from 'firebase-admin';
import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';

export default async (app: Application) => {
    app.get('/a-la-carte-walk', async (request: Request, response: Response, next: NextFunction) => {
        try {
            RepositoryContext.GetInstance().aLaCarteWalkRepository.getALaCarteWalks()
                .then((result) => {
                    response.status(StatusCodes.OK).json(result);
                    return;
                })
                .catch((error) => {
                    return next(new InternalDataBaseError(error.message, error.stack));
                });;
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};