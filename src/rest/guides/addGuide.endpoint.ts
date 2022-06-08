import { Application, NextFunction } from 'express';
import shortid from 'shortid';
import { Filedata } from '../../model/filedata.model';
import { GuideBase } from '../../model/guide.model';
import { validate } from 'class-validator';
import { Busboy } from 'busboy';
import { StatusCodes } from 'http-status-codes';
import { InternalDataBaseError, InternalServerError } from '../../error/model/errors.internal';
import { RepositoryContext } from '../../repositories/repository.context';
import { Bucket, Storage } from '@google-cloud/storage';
import { Language } from '../../model/language.model';
import path from 'path';
import sanitize from 'sanitize-filename'
import busboyFunc from 'busboy';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { isAdmin } from '../../middelware/isAdmin';
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
  app.post('/guide', isAdmin, async (request: any, response: any, next: NextFunction) => {
    try {
      let allPromises: any[] = [];
      var busboy: Busboy = busboyFunc({ headers: request.headers, limits: { files: 6, fileSize: 1500000 } });
      let newGuideBase: GuideBase = new GuideBase();
      let profilePicture: { filedata: Filedata, localPath: String };
      let images: { filedata: Filedata, localPath: String }[] = [];
      let guideId = uuidv4();

      busboy.on('field', async (fieldname: any, val: any, fieldnameTruncated: any, valTruncated: any, encoding: any, mimetype: any) => {
        // * * read guide object that is present on json field 'guide'
        try {
          if (fieldname.trim().toLowerCase() === 'guide') {
            allPromises.push(new Promise(async (resolve, reject) => {
              let guideJsonVal = JSON.parse(val);
              console.log(guideJsonVal)
              newGuideBase._id = guideId;
              newGuideBase.firstName = guideJsonVal.firstName;
              newGuideBase.lastName = guideJsonVal.lastName;
              newGuideBase.nickName = guideJsonVal.nickName;
              newGuideBase.email = guideJsonVal.email;
              newGuideBase.descriptions = guideJsonVal.descriptions;
              newGuideBase.phoneNumber = guideJsonVal.phoneNumber;
  
              let languages: Language[] = [];
              let allLanguages: Language[] = await RepositoryContext.GetInstance().languageRepository.getLanguages() as Language[];
              for(let i = 0; i < allLanguages?.length; i++) {
                for(let j = 0; j < guideJsonVal.languages.length; j++) {
                  if(allLanguages[i]._id === (guideJsonVal.languages[j] as Language)._id) {
                    languages.push(allLanguages[i])
                  }
                }
              }
              console.log('languages')
              console.log(languages)
              console.log(allLanguages)
              newGuideBase.languages = languages;
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
          if (fieldname.trim() === 'profilePicture') {
            if (!(profilePicture === undefined)) {
              return next(new InternalServerError(`There may only be 1 profile picture per guide.`, ""));
            }
            // *! wrong mime type
            if (!acceptedMimetypes.includes(imageData.mimeType)) {
              return next(new InternalServerError(`Filetype of profile picture ${imageData.filename} is incorrect.`, ""));
            }

            file.on('data', function (data: any) {
              // *! file went over limit
              if (file.truncated) {
                return next(new InternalServerError(`Filesize of profile picture ${imageData.filename} is too large.`, ""));
              }

              let sanitizedFilename = sanitize((imageData.filename as string).replace(new RegExp(' ', 'g'), '').replace(new RegExp('[()]', 'g'), '').replace(/[\[\]']+/g, ''));
              let profilePictureFiledata = new Filedata(uuidv4(), sanitizedFilename, data.length, imageData.mimeType);

              profilePictureFiledata.localUrl = `API/uploaded_content/guides/${guideId}/profilePicture/${shortid.generate()}_${profilePictureFiledata.fileName}`;
              profilePicture = {
                filedata: profilePictureFiledata,
                localPath: SaveFile(path.join(`/temp_files/${newGuideBase._id}/profilePicture/`), profilePictureFiledata.fileName, data)
              } as { filedata: Filedata, localPath: String };
            })
          }
          if (fieldname.trim() === 'images') {
            // *! to many extra images
            if (images.length == 5) {
              return next(new InternalServerError(`There is a limit of 5 additional images per guide.`, ""));
            }

            // *! wrong mime type
            if (!acceptedMimetypes.includes(imageData.mimeType)) {
              return next(new InternalServerError(`Filetype of image ${imageData.filename} is incorrect.`, ""));
            }

            file.on('data', function (data: any) {
              // *! file went over limit
              if (file.truncated) {
                return next(new InternalServerError(`Filesize of image ${imageData.filename} is too large.`, ""));
              }

              let sanitizedFilename = sanitize((imageData.filename as string).replace(new RegExp(' ', 'g'), '').replace(new RegExp('[()]', 'g'), '').replace(/[\[\]']+/g, ''));
              let imageFiledata = new Filedata(uuidv4(), sanitizedFilename, data.length, imageData.mimeType);

              imageFiledata.localUrl = `API/uploaded_content/guides/${guideId}/images/${shortid.generate()}_${imageFiledata.fileName}`;
              images.push({
                filedata: imageFiledata,
                localPath: SaveFile(path.join(`/temp_files/${newGuideBase._id}/images/`), imageFiledata.fileName, data)
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
          let newGuide: any = {
            ...newGuideBase,
            profilePicture: profilePicture?.filedata._id,
            images: images.map((element: { filedata: Filedata, localPath: String }) => element.filedata._id)
          };
          validate(newGuide)
            .then(async (errors) => {
              if (errors.length === 0) {
                console.log('validate')
                console.log(JSON.stringify(newGuide))
                // *! ADDS ALL IMAGE PROMISES TO 1 PROMISE CHAIN
                let filesUploadPromises: Promise<any>[] = [];
                filesUploadPromises.push(bucket.upload(profilePicture.localPath as string, {
                  destination: `API/uploaded_content/guides/${guideId}/profilePicture/${profilePicture.filedata.fileName}`,
                  public: true
                }));
                images.forEach((image: { filedata: Filedata, localPath: String }) => filesUploadPromises.push(bucket.upload(image.localPath as string, {
                  destination: `API/uploaded_content/guides/${guideId}/images/${image.filedata.fileName}`,
                  public: true
                })));
                Promise.all(filesUploadPromises)
                  .then((filesUploadResult) => {
                    profilePicture.filedata.fileDownloadUrl = filesUploadResult.filter((item) => item[1].mediaLink.includes(profilePicture.filedata.fileName))[0][0].metadata.mediaLink

                    for (let i = 0; i < filesUploadResult.length; i++) {
                      for (let j = 0; j < images.length; j++) {
                        if (filesUploadResult[i][1].mediaLink.includes(images[j].filedata.fileName)) {
                          images[j].filedata.fileDownloadUrl = filesUploadResult[i][1].mediaLink
                        }
                      }
                    }

                    let fileDataPromises: Promise<any>[] = [];
                    fileDataPromises.push(RepositoryContext.GetInstance().filedataRepository.addFiledata(profilePicture.filedata));
                    images.forEach((image: { filedata: Filedata, localPath: String }) => fileDataPromises.push(RepositoryContext.GetInstance().filedataRepository.addFiledata(image.filedata)));

                    Promise.all(fileDataPromises)
                      .then(() => {
                        RepositoryContext.GetInstance().guideRepository.addGuide(newGuide)
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
