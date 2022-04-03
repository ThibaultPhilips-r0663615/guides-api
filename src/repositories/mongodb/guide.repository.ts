import mongoose from 'mongoose';
import { GuideRepository } from '../guide.repository.interface';
import { Guide } from '../../model/guide.model';
import { GuidesSchema } from '../../mongodb_schemas/guide.schema';
import { InternalDataBaseError } from '../../error/model/errors.internal';
const { v4: uuidv4 } = require('uuid');

class GuideRepositoryMongoDB implements GuideRepository {
    guideModel: mongoose.Model<any, {}, {}, {}>;
    constructor() {
        this.guideModel = mongoose.model('guides', GuidesSchema)
    }

    addGuide = async (newGuide: Guide): Promise<any | undefined> => {
        const guide = new this.guideModel({
            _id: newGuide._id === undefined ? uuidv4() : newGuide._id,
            firstName: newGuide.firstName,
            lastName: newGuide.lastName,
            nickName: newGuide.nickName,
            email: newGuide.email,
            phoneNumber: newGuide.phoneNumber,
            languages: newGuide.languages,
            profilePicture: newGuide.profilePicture,
            images: newGuide.images
        });
        return guide.save();
    }

    updateGuide = async (updateGuide: Guide): Promise<any | undefined> => {
        return this.guideModel.findOneAndUpdate({ '_id': updateGuide._id }, updateGuide, { new: true }).exec()
    }

    getGuide = async (id: string): Promise<any | undefined> => {
        return this.guideModel.findOne({ '_id': id }).populate('profilePicture').populate('images').exec();
    }

    getGuides = async (): Promise<any[] | undefined> => {
        return this.guideModel.find().populate('profilePicture').populate('images').exec();
    }

    deleteGuide = async (id: string): Promise<Boolean> => {

        let result: any = await this.guideModel.deleteOne({ '_id': id }).exec().catch((err) => {
            Promise.reject(err)
        });
        return new Promise<Boolean>((resolve, reject) => {
            if (result?.deletedCount > 0)
                resolve(true);
            if (result === undefined)
                reject(new InternalDataBaseError('No guide was found with the given id', new Error().stack))

            // ** no guide was deleted
            resolve(false);
        });
    }
}

export { GuideRepositoryMongoDB }