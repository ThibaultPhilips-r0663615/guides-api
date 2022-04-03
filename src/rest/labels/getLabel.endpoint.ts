
import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';

module.exports = async (app: Application) => {
    app.get('/get-label/:labelId', async (request: Request, response: Response, next: NextFunction) => {
        try {
            const labelId = request.params.labelId as string;

            let result = await RepositoryContext.GetInstance().labelRepository.getLabel(labelId).catch((error) => {
                return next(new InternalDataBaseError(error.message, error.stack));
            });
            return response.status(StatusCodes.OK).json(result);
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};