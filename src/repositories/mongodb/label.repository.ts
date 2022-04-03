import mongoose from 'mongoose';
import { LabelRepository } from '../label.repository.interface';
import { Label } from '../../model/label.model';
import { labelsSchema } from '../../mongodb_schemas/label.schema';
import { InternalDataBaseError } from '../../error/model/errors.internal';
const { v4: uuidv4 } = require('uuid');

class LabelRepositoryMongoDB implements LabelRepository {
    labelModel: mongoose.Model<any, {}, {}, {}>;
    constructor() {
        this.labelModel = mongoose.model('labels', labelsSchema)
    }

    addLabel = async (newLabel: Label): Promise<Label | undefined> => {
        const label = new this.labelModel({
            _id: newLabel._id === undefined ? uuidv4() : newLabel._id,
            textColorCode: newLabel.textColorCode,
            colorCode: newLabel.colorCode
        });
        return label.save();
    }

    updateLabel = async (updateLabel: Label): Promise<Label | undefined> => {
        return this.labelModel.findOneAndUpdate({ '_id': updateLabel._id }, updateLabel, { new: true }).exec()
    }

    getLabel = async (id: string): Promise<Label | undefined> => {
        return this.labelModel.findOne({ '_id': id }).exec();
    }

    getLabels = async (): Promise<Label[] | undefined> => {
        return this.labelModel.find().exec();
    }

    deleteLabel = async (id: string): Promise<Boolean> => {

        let result: any = await this.labelModel.deleteOne({ '_id': id }).exec().catch((err) => {
            Promise.reject(err)
        });
        return new Promise<Boolean>((resolve, reject) => {
            if (result?.deletedCount > 0)
                resolve(true);
            if (result === undefined)
                reject(new InternalDataBaseError('No label was found with the given id', new Error().stack))

            // ** no filedata was deleted
            resolve(false);
        });
    }
}

export { LabelRepositoryMongoDB }