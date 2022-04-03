
import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';

module.exports = async (app: Application) => {
    app.get('/get-guide/:guideId', async (request: Request, response: Response, next: NextFunction) => {
        try {
            const guideId = request.params.guideId as string;

            RepositoryContext.GetInstance().guideRepository.getGuide(guideId)
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