
import { Request, Response, Application, NextFunction } from 'express';
import { InternalServerError, InternalDataBaseError } from '../../error/model/errors.internal';
import { StatusCodes } from 'http-status-codes';
import { RepositoryContext } from '../../repositories/repository.context';
import { Guide } from '../../model/guide.model';
import { Filedata } from '../../model/filedata.model';
import { Bucket, File, Storage } from '@google-cloud/storage';

const storage = new Storage();
var bucket: Bucket = storage.bucket(`${process.env.FIREBASE_CONFIG_STORAGE_BUCKET}`)

export default async (app: Application) => {
    app.delete('/guide/:guideId', async (request: Request, response: Response, next: NextFunction) => {
        try {
            const guideId = request.params.guideId as string;

            RepositoryContext.GetInstance().guideRepository.getGuide(guideId)
                .then(async (result: any) => {
                    // *! combine all filedata delete requests
                    let fileDataRepositoryPromises: Promise<any>[] = [];
                    fileDataRepositoryPromises.push(RepositoryContext.GetInstance().filedataRepository.deleteFiledata((result as Guide).profilePicture._id));
                    (result as Guide).images.forEach((image: Filedata) => RepositoryContext.GetInstance().filedataRepository.deleteFiledata(image._id));

                    Promise.all(fileDataRepositoryPromises)
                        .then(async () => {
                            let files: any = await bucket.getFiles({ prefix: `API/uploaded_content/guides/${(result as Guide)._id}/` });

                            let deleteFilesPromises: Promise<any>[] = [];

                            // *! combine all delete google cloud storage file requests
                            for (let i = 0; i < files[0].length; i++) {
                                deleteFilesPromises.push((files[0][i] as File).delete());
                            }

                            Promise.all(deleteFilesPromises)
                                .then(() => {
                                    RepositoryContext.GetInstance().guideRepository.deleteGuide(guideId)
                                        .then((result) => {
                                            if (result) {
                                                return response.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, message: `The guide with id '${guideId}' has been deleted successfully.` });
                                            }
                                            return response.status(StatusCodes.BAD_REQUEST).json({ statusCode: StatusCodes.BAD_REQUEST, message: `Guide with the given id '${guideId}' has not been deleted.` });
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