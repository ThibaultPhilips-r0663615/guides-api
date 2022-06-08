import mongoose from 'mongoose';
import { Filedata } from '../../model/filedata.model';
import { FileDataSchema } from '../../mongodb_schemas/fileData.schema';
import { IFiledataRepository } from '../filedata.repository.interface';
import { InternalDataBaseError } from '../../error/model/errors.internal';
import { v4 as uuidv4 } from 'uuid';

class FiledataRepositoryMongoDB implements IFiledataRepository {
    filedataModel: mongoose.Model<any, {}, {}, {}>;
    constructor() {
        this.filedataModel = mongoose.model('filedata', FileDataSchema)
    }

    addFiledata = async (newFiledata: Filedata): Promise<Filedata | undefined> => {
        const fileData = new this.filedataModel({
            _id: newFiledata._id === undefined ? uuidv4() : newFiledata._id,
            fileName: newFiledata.fileName,
            fileSize: newFiledata.fileSize,
            fileType: newFiledata.fileType,
            fileDownloadUrl: newFiledata.fileDownloadUrl,
            localUrl: newFiledata.localUrl,
            guides: newFiledata.guides,
        });
        return fileData.save();
    }

    updateFiledata = async (updateFiledata: Filedata): Promise<Filedata | undefined> => {
        return this.filedataModel.findOneAndUpdate({ '_id': updateFiledata._id }, updateFiledata, { new: true }).exec()
    }

    getFiledata = async (id: string): Promise<Filedata | undefined> => {
        return this.filedataModel.findOne({ '_id': id }).exec();
    }

    getFiledataList = async (): Promise<Filedata[] | undefined> => {
        return this.filedataModel.find().exec();
    }

    deleteFiledata = async (id: string): Promise<Boolean> => {

        let result: any = await this.filedataModel.deleteOne({ '_id': id }).exec().catch((err) => {
            Promise.reject(err)
        });
        return new Promise<Boolean>((resolve, reject) => {
            if (result?.deletedCount > 0)
                resolve(true);
            if (result === undefined)
                reject(new InternalDataBaseError('No filedata was found with the given id', new Error().stack))

            // ** no filedata was deleted
            resolve(false);
        });
    }
}

export { FiledataRepositoryMongoDB }