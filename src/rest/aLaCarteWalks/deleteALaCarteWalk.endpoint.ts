
import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';
import { Filedata } from '../../model/filedata.model';
import { Bucket, File, Storage } from '@google-cloud/storage';
import { isAdmin } from '../../middelware/isAdmin';
import { ALaCarteWalk } from '../../model/aLaCarteWalk.model';

const storage = new Storage();
var bucket: Bucket = storage.bucket(`${process.env.FIREBASE_CONFIG_STORAGE_BUCKET}`)

export default async (app: Application) => {
    app.delete('/a-la-carte-walks/:walkId', isAdmin, async (request: Request, response: Response, next: NextFunction) => {
        try {
            const walkId = request.params.walkId as string;
            console.log(walkId)

            RepositoryContext.GetInstance().aLaCarteWalkRepository.getALaCarteWalk(walkId)
                .then(async (result: any) => {
                    console.log(result)
                    // *! combine all filedata delete requests
                    let fileDataRepositoryPromises: Promise<any>[] = [];
                    fileDataRepositoryPromises.push(RepositoryContext.GetInstance().filedataRepository.deleteFiledata((result as ALaCarteWalk).banner._id));
                    (result as ALaCarteWalk).images.forEach((image: Filedata) => RepositoryContext.GetInstance().filedataRepository.deleteFiledata(image._id));

                    Promise.all(fileDataRepositoryPromises)
                        .then(async () => {
                            let files: any = await bucket.getFiles({ prefix: `API/uploaded_content/a_la_carte_walks/${(result as ALaCarteWalk)._id}/` });

                            let deleteFilesPromises: Promise<any>[] = [];

                            // *! combine all delete google cloud storage file requests
                            for (let i = 0; i < files[0].length; i++) {
                                deleteFilesPromises.push((files[0][i] as File).delete());
                            }

                            Promise.all(deleteFilesPromises)
                                .then(() => {
                                    RepositoryContext.GetInstance().aLaCarteWalkRepository.deleteALaCarteWalk(walkId)
                                        .then((result) => {
                                            if (result) {
                                                return response.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, message: `The a la carte walk with id '${walkId}' has been deleted successfully.` });
                                            }
                                            return response.status(StatusCodes.BAD_REQUEST).json({ statusCode: StatusCodes.BAD_REQUEST, errorMessage: `The a la carte walk with the given id '${walkId}' has not been deleted.` });
                                        })
                                        .catch((error) => {
                                            return next(new InternalDataBaseError(error.message, error.stack));
                                        });
                                })
                                .catch((error) => {
                                    return next(new InternalDataBaseError(error.message, error.stack));
                                });
                        }).catch((error) => {
                            return next(new InternalDataBaseError(error.message, error.stack));
                        });
                }).catch((error) => {
                    return next(new InternalDataBaseError(error.message, error.stack));
                });
        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });
};