import mongoose from 'mongoose';
import { Language } from '../../model/language.model';
import { LanguagesSchema } from '../../mongodb_schemas/languages.schema';
import { LanguageRepository } from '../language.repository.interface';
import { InternalDataBaseError } from '../../error/model/errors.internal';
const { v4: uuidv4 } = require('uuid');

class LanguageRepositoryMongoDB implements LanguageRepository {
    languageModel: mongoose.Model<any, {}, {}, {}>;
    constructor() {
        this.languageModel = mongoose.model('languages', LanguagesSchema)
    }

    addLanguage = async (newLanguage: Language): Promise<Language | undefined> => {
        const Language = new this.languageModel({
            _id: newLanguage._id === undefined ? uuidv4() : newLanguage._id,
            locale: newLanguage.locale,
            languageCode: newLanguage.languageCode,
            isMainLanguage: newLanguage.isMainLanguage,
            guides: newLanguage.guides
        });
        return Language.save();
    }

    updateLanguage = async (updateLanguage: Language): Promise<Language | undefined> => {
        return this.languageModel.findOneAndUpdate({ '_id': updateLanguage._id }, updateLanguage, { new: true }).exec()
    }

    getLanguage = async (id: string): Promise<Language | undefined> => {
        return this.languageModel.findOne({ '_id': id }).exec();
    }

    getLanguages = async (): Promise<Language[] | undefined> => {
        return this.languageModel.find().exec();
    }

    deleteLanguage = async (id: string): Promise<Boolean> => {

        let result: any = await this.languageModel.deleteOne({ '_id': id }).exec().catch((err) => {
            Promise.reject(err)
        });
        return new Promise<Boolean>((resolve, reject) => {
            if (result?.deletedCount > 0)
                resolve(true);
            if (result === undefined)
                reject(new InternalDataBaseError('No langauage was found with the given id', new Error().stack))

            // ** no filedata was deleted
            resolve(false);
        });
    }
}

export { LanguageRepositoryMongoDB }