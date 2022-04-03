import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';

module.exports = async (app: Application) => {
    app.get('/get-language/:languageId', async (request: Request, response: Response, next: NextFunction) => {
        try {
            const languageId = request.params.languageId as string;

            RepositoryContext.GetInstance().languageRepository.getLanguage(languageId)
                .then((result) => {
                    return response.status(StatusCodes.OK).json(result);
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