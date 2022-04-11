import addLanuage from './addLanuage.endpoint';
import getLanguage from './getLanguage.endpoint';
import getLanguages from './getLanguages.endpoint';
import updateLanguage from './updateLanguage.endpoint';
import deleteLanguage from './deleteLanguage.endpoint';
import { Application } from 'express';

export default (app: Application) => {
    addLanuage(app);
    getLanguage(app);
    getLanguages(app);
    updateLanguage(app);
    deleteLanguage(app);
};