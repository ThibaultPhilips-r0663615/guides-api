import { Request, Response, Application, NextFunction } from 'express';
import { InternalDataBaseError, InternalServerError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';

export default async (app: Application) => {
    app.delete('/address/:addressId', async (request: Request, response: Response, next: NextFunction) => {
        try {
            const addressId = request.params.addressId as string;

            RepositoryContext.GetInstance().addressRepository.deleteAddress(addressId)
                .then((result) => {
                    if (result) {
                        return response.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, message: `The address with id '${addressId}' has been deleted successfully.` });
                    }
                    return response.status(StatusCodes.BAD_REQUEST).json({ statusCode: StatusCodes.BAD_REQUEST, message: `Address with the given id '${addressId}' has not been deleted. Give a valid ID.` });
                })
                .catch((error) => {
                    return next(new InternalDataBaseError(error.message, error.stack));
                });;
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};