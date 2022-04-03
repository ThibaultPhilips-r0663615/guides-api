import { Connection } from 'typeorm';
import { Language } from '../../model/language.model';
import { LanguageRepository } from '../language.repository.interface';
import { getConnection } from '../database_sql.utils';

class LanguageRepositorySQL implements LanguageRepository {
    addLanguage = async (newLanguage: Language): Promise<Language | undefined> => {
        let connection: Connection = getConnection(undefined);
        let languageRepository = connection.getRepository(Language);
        return languageRepository.save(newLanguage).then(async () => {
            return languageRepository.findOne(newLanguage._id);
        })
    }
    
    updateLanguage = async (updateLanguage: Language): Promise<Language | undefined> => {
        let connection: Connection = getConnection(undefined);
        let languageRepository = connection.getRepository(Language);
        return languageRepository.save(updateLanguage).then(async () => {
            return languageRepository.findOne(updateLanguage._id);
        })
    }
    
    getLanguage = async (id: string): Promise<Language | undefined> => {
        let connection: Connection = getConnection(undefined);
        let languageRepository = connection.getRepository(Language);
        return languageRepository.findOne(id);
    }
    
    getLanguages = async (): Promise<Language[]> => {
        let connection: Connection = getConnection(undefined);
        let languageRepository = connection.getRepository(Language);
        let result: Language[] = await languageRepository.find()
        return result ? result : [];
    }

    deleteLanguage = async (id: string): Promise<Boolean> => {
        let connection: Connection = getConnection(undefined);
        let languageRepository = connection.getRepository(Language);
        let language: Language | undefined = await languageRepository.findOne(id);
        await languageRepository.remove(language!);
        return Promise.resolve(true);
    }
}

export {LanguageRepositorySQL}