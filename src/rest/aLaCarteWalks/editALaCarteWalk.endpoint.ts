import { Application, NextFunction } from 'express';
import shortid from 'shortid';
import { Filedata } from '../../model/filedata.model';
import { Guide } from '../../model/guide.model';
import { validate } from 'class-validator';
import { Busboy } from 'busboy';
import { StatusCodes } from 'http-status-codes';
import { InternalDataBaseError, InternalServerError } from '../../error/model/errors.internal';
import { RepositoryContext } from '../../repositories/repository.context';
import { Bucket, File, Storage } from '@google-cloud/storage';
import { Language } from '../../model/language.model';
import path from 'path';
import sanitize from 'sanitize-filename'
import busboyFunc from 'busboy';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { isAdmin } from '../../middelware/isAdmin';
import { ALaCarteWalk } from '../../model/aLaCarteWalk.model';
import { Label } from '../../model/label.model';
const storage = new Storage();
var bucket: Bucket;

const acceptedMimetypes: String[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
]

export default async (app: Application) => {
    bucket = storage.bucket(`${process.env.FIREBASE_CONFIG_STORAGE_BUCKET}`)
    app.put('/a-la-carte-walks/:walkId', isAdmin, async (request: any, response: any, next: NextFunction) => {
        try {
            const walkId = request.params.walkId as string;
            let allPromises: any[] = [];
            var busboy: Busboy = busboyFunc({ headers: request.headers, limits: { files: 6, fileSize: 1500000 } });
            let banner: { filedata: Filedata, localPath: String };
            let images: { filedata: Filedata, localPath: String }[] = [];

            RepositoryContext.GetInstance().aLaCarteWalkRepository.getALaCarteWalk(walkId)
                .then((result) => {
                    let aLaCarteWalk: ALaCarteWalk = result as ALaCarteWalk;
                    busboy.on('field', async (fieldname: any, val: any, fieldnameTruncated: any, valTruncated: any, encoding: any, mimetype: any) => {
                        // * * read a la carte walk object that is present on json field 'a la care walk'
                        try {
                            if (fieldname.trim().toLowerCase() === 'aLaCarteWalk') {
                                allPromises.push(new Promise(async (resolve, reject) => {
                                    let aLaCarteWalkJsonVal = JSON.parse(val);
                                    console.log(aLaCarteWalkJsonVal)

                                    if (walkId != aLaCarteWalkJsonVal._id) {
                                        return next(new InternalServerError(`The a la carte walk's id parameter and body id do not match.`, ""));
                                    }

                                    aLaCarteWalk.titles = aLaCarteWalkJsonVal.titles;
                                    aLaCarteWalk.descriptions = aLaCarteWalkJsonVal.descriptions;
                                    aLaCarteWalk.pricePerPerson = aLaCarteWalkJsonVal.pricePerPerson;
                                    aLaCarteWalk.duration = aLaCarteWalkJsonVal.duration;
                                    aLaCarteWalk.startLocation = aLaCarteWalkJsonVal.startLocation;
                                    aLaCarteWalk.endLocation = aLaCarteWalkJsonVal.endLocation;

                                    let labels: Label[] = [];
                                    let allLabels: Label[] = await RepositoryContext.GetInstance().labelRepository.getLabels() as Label[];
                                    for (let i = 0; i < allLabels?.length; i++) {
                                        for (let j = 0; j < aLaCarteWalkJsonVal.labels.length; j++) {
                                            if (allLabels[i]._id === (aLaCarteWalkJsonVal.labels[j] as Language)._id) {
                                                labels.push(allLabels[i])
                                            }
                                        }
                                    }
                                    aLaCarteWalk.labels = labels;

                                    let languages: Language[] = [];
                                    let allLanguages: Language[] = await RepositoryContext.GetInstance().languageRepository.getLanguages() as Language[];
                                    for (let i = 0; i < allLanguages?.length; i++) {
                                        for (let j = 0; j < aLaCarteWalkJsonVal.languages.length; j++) {
                                            if (allLanguages[i]._id === (aLaCarteWalkJsonVal.languages[j] as Language)._id) {
                                                languages.push(allLanguages[i])
                                            }
                                        }
                                    }
                                    aLaCarteWalk.languages = languages;
                                    let guides: Guide[] = [];
                                    let allGuides: Guide[] = await RepositoryContext.GetInstance().guideRepository.getGuides() as Guide[];
                                    for (let i = 0; i < allGuides?.length; i++) {
                                        for (let j = 0; j < aLaCarteWalkJsonVal.guides.length; j++) {
                                            if (allGuides[i]._id === (aLaCarteWalkJsonVal.guides[j] as Language)._id) {
                                                guides.push(allGuides[i])
                                            }
                                        }
                                    }
                                    aLaCarteWalk.guides = guides;
                                    resolve(true);
                                }
                                ))
                            }
                        }
                        catch (error: any) {
                            return next(new InternalServerError(error.message, error.stack));
                        }
                    });

                    busboy.on('file', (fieldname: string, file: any, imageData: any) => {
                        // * * file contains filename, encoding and mimetype
                        try {
                            if (fieldname.trim() === 'banner') {
                                if (!(banner === undefined)) {
                                    return next(new InternalServerError(`There may only be 1 banner per a la carte walk.`, ""));
                                }
                                // *! wrong mime type
                                if (!acceptedMimetypes.includes(imageData.mimeType)) {
                                    return next(new InternalServerError(`Filetype of banner ${imageData.filename} is incorrect.`, ""));
                                }

                                file.on('data', function (data: any) {
                                    // *! file went over limit
                                    if (file.truncated) {
                                        return next(new InternalServerError(`Filesize of banner ${imageData.filename} is too large, max is 1.5MB..`, ""));
                                    }

                                    let sanitizedFilename = sanitize((imageData.filename as string).replace(new RegExp(' ', 'g'), '').replace(new RegExp('[()]', 'g'), '').replace(/[\[\]']+/g, ''));
                                    let bannerFiledata = new Filedata(uuidv4(), sanitizedFilename, data.length, imageData.mimeType);

                                    bannerFiledata.localUrl = `API/uploaded_content/a_la_carte_walks/${walkId}/banner/${shortid.generate()}_${bannerFiledata.fileName}`;
                                    banner = {
                                        filedata: bannerFiledata,
                                        localPath: SaveFile(path.join(`/temp_files/${walkId}/banner/`), bannerFiledata.fileName, data)
                                    } as { filedata: Filedata, localPath: String };
                                })
                            }
                            if (fieldname.trim() === 'images') {
                                // *! to many extra images
                                if (images.length == 5) {
                                    return next(new InternalServerError(`There is a limit of 5 additional images per a la carte walk.`, ""));
                                }

                                // *! wrong mime type
                                if (!acceptedMimetypes.includes(imageData.mimeType)) {
                                    return next(new InternalServerError(`Filetype of image ${imageData.filename} is incorrect.`, ""));
                                }

                                file.on('data', function (data: any) {
                                    // *! file went over limit
                                    if (file.truncated) {
                                        return next(new InternalServerError(`Filesize of image ${imageData.filename} is too large, max is 1.5MB..`, ""));
                                    }

                                    let sanitizedFilename = sanitize((imageData.filename as string).replace(new RegExp(' ', 'g'), '').replace(new RegExp('[()]', 'g'), '').replace(/[\[\]']+/g, ''));
                                    let imageFiledata = new Filedata(uuidv4(), sanitizedFilename, data.length, imageData.mimeType);

                                    imageFiledata.localUrl = `API/uploaded_content/a_la_carte_walks/${walkId}/images/${shortid.generate()}_${imageFiledata.fileName}`;
                                    images.push({
                                        filedata: imageFiledata,
                                        localPath: SaveFile(path.join(`/temp_files/${walkId}/images/`), imageFiledata.fileName, data)
                                    } as { filedata: Filedata, localPath: String })
                                })
                            }
                        }
                        catch (error: any) {
                            return next(new InternalServerError(error.message, error.stack));
                        }
                    });

                    busboy.on('error', function (error: any) {
                        return next(new InternalServerError(error.message, error.stack));
                    })

                    busboy.on('finish', async function () {
                        try {
                            await Promise.all(allPromises);
                            let newALaCarteWalk: any = {
                                _id: walkId,
                                titles: aLaCarteWalk["titles"],
                                descriptions: aLaCarteWalk["descriptions"],
                                pricePerPerson: aLaCarteWalk["pricePerPerson"],
                                duration: aLaCarteWalk["duration"],
                                startLocation: aLaCarteWalk["startLocation"],
                                endLocation: aLaCarteWalk["endLocation"],
                                labels: aLaCarteWalk["labels"],
                                languages: aLaCarteWalk["languages"],
                                guides: aLaCarteWalk["guides"],
                                banner: banner?.filedata._id,
                                images: images.map((element: { filedata: Filedata, localPath: String }) => element.filedata._id)
                            };
                            validate(newALaCarteWalk)
                                .then(async (errors) => {
                                    if (errors.length === 0) {
                                        let files: any = await bucket.getFiles({ prefix: `API/uploaded_content/a_la_carte_walks/${(result as ALaCarteWalk)._id}/` });

                                        let deleteFilesPromises: Promise<any>[] = [];

                                        // *! combine all delete google cloud storage file requests
                                        for (let i = 0; i < files[0].length; i++) {
                                            deleteFilesPromises.push((files[0][i] as File).delete());
                                        }

                                        Promise.all(deleteFilesPromises)
                                            .then(() => {
                                                // *! ADDS ALL IMAGE PROMISES TO 1 PROMISE CHAIN
                                                let filesUploadPromises: Promise<any>[] = [];
                                                filesUploadPromises.push(bucket.upload(banner.localPath as string, {
                                                    destination: `API/uploaded_content/a_la_carte_walks/${walkId}/banner/${banner.filedata.fileName}`,
                                                    public: true
                                                }));
                                                images.forEach((image: { filedata: Filedata, localPath: String }) => filesUploadPromises.push(bucket.upload(image.localPath as string, {
                                                    destination: `API/uploaded_content/a_la_carte_walks/${walkId}/images/${image.filedata.fileName}`,
                                                    public: true
                                                })));
                                                Promise.all(filesUploadPromises)
                                                    .then((filesUploadResult) => {
                                                        banner.filedata.fileDownloadUrl = filesUploadResult.filter((item) => item[1].mediaLink.includes(banner.filedata.fileName))[0][0].metadata.mediaLink

                                                        for (let i = 0; i < filesUploadResult.length; i++) {
                                                            for (let j = 0; j < images.length; j++) {
                                                                if (filesUploadResult[i][1].mediaLink.includes(images[j].filedata.fileName)) {
                                                                    images[j].filedata.fileDownloadUrl = filesUploadResult[i][1].mediaLink
                                                                }
                                                            }
                                                        }

                                                        let fileDataPromises: Promise<any>[] = [];
                                                        fileDataPromises.push(RepositoryContext.GetInstance().filedataRepository.addFiledata(banner.filedata));
                                                        images.forEach((image: { filedata: Filedata, localPath: String }) => fileDataPromises.push(RepositoryContext.GetInstance().filedataRepository.addFiledata(image.filedata)));

                                                        Promise.all(fileDataPromises)
                                                            .then(() => {
                                                                RepositoryContext.GetInstance().aLaCarteWalkRepository.updateALaCarteWalk(newALaCarteWalk)
                                                                    .then((result) => {
                                                                        response.status(StatusCodes.OK).json(result);
                                                                        return;
                                                                    })
                                                                    .catch((error) => {
                                                                        return next(new InternalDataBaseError(error.message, error.stack));
                                                                    });
                                                            })
                                                            .catch((error) => {
                                                                return next(new InternalDataBaseError(error.message, error.stack));
                                                            });
                                                    })
                                                    .catch((error) => {
                                                        return next(new InternalDataBaseError(error.message, error.stack));
                                                    });
                                            })
                                            .catch((error) => {
                                                return next(new InternalDataBaseError(error.message, error.stack));
                                            });



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

                    busboy.end(request.rawBody)
                    return;
                })
                .catch((error) => {
                    return next(new InternalDataBaseError(error.message, error.stack));
                });


        }
        catch (error: any) {
            return next(new InternalServerError(error.message, error.stack));
        }
    });

    function SaveFile(targetPath: string, fileName: String, data: any): String {
        let directories: string[] = targetPath.split('\\');
        let currentDirectory = path.join(process.cwd(), `./lib`);

        directories.forEach((dir: string) => {
            currentDirectory = path.join(currentDirectory, `./${dir}`);
            if (!fs.existsSync(currentDirectory)) {
                fs.mkdirSync(currentDirectory);
            }
        })
        currentDirectory = path.join(currentDirectory, `${fileName}`);
        fs.writeFileSync(currentDirectory, data)
        return currentDirectory;
    }

    /*function DeleteTempFiles() {
  
    }
  
    function DeleteGoogleCloudFiles() {
  
    }*/
};
