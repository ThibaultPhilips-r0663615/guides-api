import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';

export default async (app: Application) => {
    app.get('/get-labels', async (request: Request, response: Response, next: NextFunction) => {
        try {
            let result = await RepositoryContext.GetInstance().labelRepository.getLabels()
                .catch((error) => {
                    return next(new InternalDataBaseError(error.message, error.stack));
                });
            return response.status(StatusCodes.OK).json(result);
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};