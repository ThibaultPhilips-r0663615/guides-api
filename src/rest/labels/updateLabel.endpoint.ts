import { Request, Response, Application, NextFunction } from 'express';
import { validate } from 'class-validator';
import { Label } from '../../model/label.model';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { isAdmin } from '../../middelware/isAdmin';
import { RepositoryContext } from '../../repositories/repository.context';

export default async (app: Application) => {
    app.put('/update-label/:labelId', isAdmin, async (request: Request, response: Response, next: NextFunction) => {
        try {
            const labelId = request.params.labelId as string;
            if (labelId == request.body['_id']) {

                let updatedLabel: Label = new Label(
                    labelId,
                    request.body['colorCode'],
                    request.body['textColorCode']
                );

                validate(updatedLabel)
                    .then(async (errors) => {
                        if (errors.length === 0) {
                            let result = await RepositoryContext.GetInstance().labelRepository.updateLabel(updatedLabel)
                                .catch((error) => {
                                    return next(new InternalDataBaseError(error.message, error.stack));
                                });
                            return response.status(StatusCodes.OK).json(result);
                        }
                        else {
                            return response.status(StatusCodes.BAD_REQUEST).send(errors);
                        }
                    })
                    .catch((error: any) => {
                        return next(new InternalServerError(error.message, error.stack));
                    });
            }
            else {
                response.status(StatusCodes.BAD_REQUEST).send('The label id of the body and request param should be the same.');
                return;
            }
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};