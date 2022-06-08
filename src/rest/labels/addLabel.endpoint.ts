import { Request, Response, Application, NextFunction } from 'express';
import { validate } from 'class-validator';
import { Label } from '../../model/label.model';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';
import { v4 as uuidv4 } from 'uuid';
import { isAdmin } from '../../middelware/isAdmin';

export default async (app: Application) => {
    app.post('/add-label', isAdmin, async (request: Request, response: Response, next: NextFunction) => {
        try {
            let labelId = uuidv4();

            let newLabel: Label = new Label(
                labelId,
                request.body['colorCode'],
                request.body['textColorCode'],
                request.body['texts']
            );

            validate(newLabel)
                .then(async (errors) => {
                    if (errors.length === 0) {
                        let result = await RepositoryContext.GetInstance().labelRepository.addLabel(newLabel).catch((error) => {
                            return next(new InternalDataBaseError(error.message, error.stack));
                        })
                        return response.status(StatusCodes.OK).json(result);
                    }
                    else {
                        response.status(StatusCodes.BAD_REQUEST).json(errors);
                        return;
                    }
                })
                .catch((error: any) => {
                    return next(new InternalServerError(error.message, error.stack));
                });
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};