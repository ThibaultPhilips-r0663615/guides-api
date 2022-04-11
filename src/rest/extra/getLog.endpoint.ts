import { Request, Response, Application, NextFunction } from 'express';
import { isAdmin } from '../../middelware/isAdmin';
import { StatusCodes } from 'http-status-codes';
import { InternalDataBaseError } from '../../error/model/errors.internal';
import { LoggingContext } from '../../error/service/logging.context';

export default async(app: Application) => {
    app.get('/get-log/:date', isAdmin, async (request: Request, response: Response, next: NextFunction) => {
        const date = request.params.date as string;

        LoggingContext.GetInstance().GetLoggingService().readErrorsFromLogDate(new Date(date))
            .then((result) => {
                response.status(StatusCodes.OK).json(result);
                return;
            })
            .catch(error => {
                return next(new InternalDataBaseError(error.message, error.stack));
            });
        ;
    });
};