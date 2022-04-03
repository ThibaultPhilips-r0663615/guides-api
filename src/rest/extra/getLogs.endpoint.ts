import { Request, Response, Application, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { InternalDataBaseError } from '../../error/model/errors.internal';
import { LoggingContext } from '../../error/service/logging.context';

module.exports = (app: Application) => {
    app.get('/get-logs', async (request: Request, response: Response, next: NextFunction) => {
        LoggingContext.GetInstance().GetLoggingService().readAllErrorsFromLogs()
            .then((result) => {
                response.status(StatusCodes.OK).json(result);
            })
            .catch(error => {
                return next(new InternalDataBaseError(error.message, error.stack));
            });
    });
};