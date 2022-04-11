import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';

export default async (app: Application) => {
    app.delete('/label/:labelId', async (request: Request, response: Response, next: NextFunction) => {
        try {
            const labelId = request.params.labelId as string;

            let result = await RepositoryContext.GetInstance().labelRepository.deleteLabel(labelId).catch((error) => {
                return next(new InternalDataBaseError(error.message, error.stack));
            });
            if (result) {
                return response.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, message: `The label with id '${labelId}' has been deleted successfully.` });
            }
            return response.status(StatusCodes.BAD_REQUEST).json({ statusCode: StatusCodes.BAD_REQUEST, message: `Label with the given id '${labelId}' has not been deleted. Give a valid ID.` });

        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};