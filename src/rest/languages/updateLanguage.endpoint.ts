import { Request, Response, Application, NextFunction } from 'express';
import { Language } from '../../model/language.model';
import { validate } from 'class-validator';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { isAdmin } from '../../middelware/isAdmin';
import { RepositoryContext } from '../../repositories/repository.context';

export default async (app: Application) => {
    app.put('/update-language/:languageId', isAdmin, async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.params.languageId == request.body['languageId']) {
                const languageId = request.params.languageId as string;

                let updatedLanguage: Language = new Language(
                    languageId,
                    request.body['locale'],
                    request.body['languageCode'],
                    request.body['isMainLanguage']
                );

                validate(updatedLanguage)
                    .then(async (errors) => {
                        if (errors.length === 0) {
                            RepositoryContext.GetInstance().languageRepository.updateLanguage(updatedLanguage)
                                .then((result) => {
                                    return response.status(StatusCodes.OK).json(result);
                                })
                                .catch((error) => {
                                    return next(new InternalDataBaseError(error.message, error.stack));
                                });;
                        }
                        else {
                            response.status(StatusCodes.BAD_REQUEST).send(errors);
                            return;
                        }
                    })
                    .catch((error: any) => {
                        return next(new InternalServerError(error.message, error.stack));
                    });
            }
            else {
                return response.status(StatusCodes.BAD_REQUEST).send('The langauge id of the body and request param should be the same.');
            }
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};