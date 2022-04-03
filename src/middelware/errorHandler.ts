import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes';
import { ExternalApiError } from '../error/model/errors.external';
import { LoggingContext } from '../error/service/logging.context';

export const errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
    LoggingContext.GetInstance().GetLoggingService().writeErrorToLog(request.path ? { path: request.path, ...error } : error);
    response.status(StatusCodes.BAD_REQUEST).json(new ExternalApiError(error.id, error.message, error.date, StatusCodes.BAD_REQUEST));
    return;
};