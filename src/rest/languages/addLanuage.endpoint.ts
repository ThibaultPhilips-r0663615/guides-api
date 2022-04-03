import { Request, Response, Application, NextFunction } from 'express';
import { Language } from '../../model/language.model';
import { validate } from 'class-validator';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';
const { v4: uuidv4 } = require('uuid');


module.exports = async (app: Application) => {
    app.post('/add-language', async (request: Request, response: Response, next: NextFunction) => {
        try {
            let id = uuidv4();

            let newLanguage: Language = new Language(
                id,
                request.body['locale'],
                request.body['languageCode'],
                request.body['isMainLanguage']
            );

            validate(newLanguage)
                .then(async (errors) => {
                    if (errors.length === 0) {
                        RepositoryContext.GetInstance().languageRepository.addLanguage(newLanguage)
                            .then((result) => {
                                response.status(StatusCodes.OK).send(result);
                                return;
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
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    })
};