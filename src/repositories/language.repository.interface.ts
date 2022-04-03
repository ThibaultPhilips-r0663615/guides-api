import { Language } from './../model/language.model';

interface LanguageRepository {
    addLanguage: (addLanguage: Language) => Promise<Language | undefined>;
    updateLanguage: (updateLanguage: Language) => Promise<Language | undefined>;
    getLanguage: (id: string) => Promise<Language | undefined>;
    getLanguages: () => Promise<Language[] | undefined>;
    deleteLanguage: (id: string) => Promise<Boolean>;
}

export {LanguageRepository}