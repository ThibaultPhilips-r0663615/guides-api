import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';
import { isAdmin } from '../../middelware/isAdmin';

export default async (app: Application) => {
    app.delete('/label/:labelId', isAdmin, async (request: Request, response: Response, next: NextFunction) => {
        try {
            const labelId = request.params.labelId as string;

            let result = await RepositoryContext.GetInstance().labelRepository.deleteLabel(labelId).catch((error) => {
                return next(new InternalDataBaseError(error.message, error.stack));
            });
            if (result) {
                return response.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, message: `The label with id '${labelId}' has been deleted successfully.` });
            }
            return response.status(StatusCodes.BAD_REQUEST).json({ statusCode: StatusCodes.BAD_REQUEST, errorMessage: `Label with the given id '${labelId}' has not been deleted. Give a valid ID.` });

        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};