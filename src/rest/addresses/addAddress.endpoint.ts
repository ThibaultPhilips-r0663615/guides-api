import { Request, Response, Application, NextFunction } from 'express';
import { validate } from 'class-validator';
import { Address } from '../../model/address.model';
import { InternalDataBaseError, InternalServerError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { isAdmin } from '../../middelware/isAdmin';
import { RepositoryContext } from '../../repositories/repository.context';
import { v4 as uuidv4 } from 'uuid';

export default async (app: Application) => {
    app.post('/add-address', isAdmin, async (request: Request, response: Response, next: NextFunction) => {
        try {
            let addressId = uuidv4();

            let newAddress: Address = new Address(
                addressId,
                request.body['streetName'],
                request.body['houseNumber'],
                request.body['cityName'],
                request.body['postcode'],
                request.body['description']
            );

            validate(newAddress)
                .then(async (errors) => {
                    if (errors.length === 0) {
                        RepositoryContext.GetInstance().addressRepository.addAddress(newAddress)
                            .then((result) => {
                                response.status(StatusCodes.OK).json(result);
                                return;
                            })
                            .catch((error) => {
                                return next(new InternalDataBaseError(error.message, error.stack));
                            });;
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