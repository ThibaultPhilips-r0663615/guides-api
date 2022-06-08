import { Request, Response, Application, NextFunction } from 'express';
import { validate } from 'class-validator';
import { Address } from '../../model/address.model';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { isAdmin } from '../../middelware/isAdmin';
import { RepositoryContext } from '../../repositories/repository.context';

export default async (app: Application) => {
    app.put('/update-address/:addressId', isAdmin, async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.params.addressId == request.body['_id']) {
                const addressId = request.params.addressId as string;

                let updatedAddress: Address = new Address(
                    addressId,
                    request.body['streetName'],
                    request.body['houseNumber'],
                    request.body['cityName'],
                    request.body['postcode'],
                    request.body['description']
                );

                validate(updatedAddress)
                    .then(async (errors) => {
                        if (errors.length === 0) {
                            RepositoryContext.GetInstance().addressRepository.updateAddress(updatedAddress)
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
            else {
                response.status(StatusCodes.BAD_REQUEST).json({ statusCode: StatusCodes.BAD_REQUEST, errorMessage: 'The address id of the body and request param should be the same.' });
            }
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};