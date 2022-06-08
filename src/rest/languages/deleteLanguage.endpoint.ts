import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';
import { isAdmin } from '../../middelware/isAdmin';

export default async (app: Application) => {
    app.delete('/language/:languageId', isAdmin, async (request: Request, response: Response, next: NextFunction) => {
        try {
            const languageId = request.params.languageId as string;

            RepositoryContext.GetInstance().languageRepository.deleteLanguage(languageId)
                .then((result) => {
                    if (result) {
                        return response.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, message: `The language with id '${languageId}' has been deleted successfully.` });
                    }
                    return response.status(StatusCodes.BAD_REQUEST).json({ statusCode: StatusCodes.BAD_REQUEST, errorMessage: `Language with the given id '${languageId}' has not been deleted. Give a valid ID.` });
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