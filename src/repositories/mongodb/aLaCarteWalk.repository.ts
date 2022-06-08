import mongoose from 'mongoose';
import { InternalDataBaseError } from '../../error/model/errors.internal';
import { v4 as uuidv4 } from 'uuid';
import { ALaCarteWalksSchema } from '../../mongodb_schemas/aLaCarteWalk.schema';
import { ALaCarteWalk } from '../../model/aLaCarteWalk.mode';
import { IALaCarteWalkRepository } from '../aLaCarteWalk.repository.interface';

class ALaCarteWalkRepositoryMongoDB implements IALaCarteWalkRepository {
    aLaCarteWalkModel: mongoose.Model<any, {}, {}, {}>;
    constructor() {
        this.aLaCarteWalkModel = mongoose.model('aLaCarteWalks', ALaCarteWalksSchema)
    }

    addALaCarteWalk = async (newALaCarteWalk: ALaCarteWalk): Promise<any | undefined> => {
        console.log('add aLaCarteWalk repo')
        console.log(JSON.stringify(newALaCarteWalk))
        const aLaCarteWalk = new this.aLaCarteWalkModel({
            _id: newALaCarteWalk._id === undefined ? uuidv4() : newALaCarteWalk._id,
            titles: newALaCarteWalk.titles,
            descriptions: newALaCarteWalk.descriptions,
            pricePerPerson: newALaCarteWalk.pricePerPerson,
            duration: newALaCarteWalk.duration,
            startLocation: newALaCarteWalk.startLocation,
            endLocation: newALaCarteWalk.endLocation,
            labels: newALaCarteWalk.labels,
            languages: newALaCarteWalk.languages,
            guides: newALaCarteWalk.guides,
            banner: newALaCarteWalk.banner,
            images: newALaCarteWalk.images
        });
        return aLaCarteWalk.save();
    }

    updateALaCarteWalk = async (updateALaCarteWalk: ALaCarteWalk): Promise<any | undefined> => {
        return this.aLaCarteWalkModel.findOneAndUpdate({ '_id': updateALaCarteWalk._id }, updateALaCarteWalk, { new: true }).exec()
    }

    getALaCarteWalk = async (id: string): Promise<any | undefined> => {
        return this.aLaCarteWalkModel.findOne({ '_id': id }).populate('labels').populate('languages').populate('guides').populate('banner').populate('images').exec();
    }

    getALaCarteWalks = async (): Promise<any[] | undefined> => {
        return this.aLaCarteWalkModel.find().populate('labels').populate('languages').populate('guides').populate('banner').populate('images').exec();
    }

    deleteALaCarteWalk = async (id: string): Promise<Boolean> => {

        let result: any = await this.aLaCarteWalkModel.deleteOne({ '_id': id }).exec().catch((err) => {
            Promise.reject(err)
        });
        return new Promise<Boolean>((resolve, reject) => {
            if (result?.deletedCount > 0)
                resolve(true);
            if (result === undefined)
                reject(new InternalDataBaseError('No a la carte walk was found with the given id', new Error().stack))

            // ** no a la carte walk was deleted
            resolve(false);
        });
    }
}

export { ALaCarteWalkRepositoryMongoDB }