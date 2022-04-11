
import { Request, Response, Application, NextFunction } from 'express';
import { InternalDataBaseError, InternalServerError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';

export default async (app: Application) => {
    app.get('/get-addresses', async (request: Request, response: Response, next: NextFunction) => {
        try {
            RepositoryContext.GetInstance().addressRepository.getAddresses()
                .then((result) => {
                    response.status(StatusCodes.OK).json(result);
                    return;
                })
                .catch((error) => {
                    return next(new InternalDataBaseError(error.message, error.stack));
                });
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};