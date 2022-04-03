import { Application } from 'express';
module.exports = (app: Application) => {
    require('./addLanuage.endpoint')(app)
    require('./getLanguage.endpoint')(app)
    require('./getLanguages.endpoint')(app)
    require('./updateLanguage.endpoint')(app)
    require('./deleteLanguage.endpoint')(app)
};