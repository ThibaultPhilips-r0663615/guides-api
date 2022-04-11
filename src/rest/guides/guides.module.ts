import addGuide from './addGuide.endpoint';
import getGuide from './getGuide.endpoint';
import getGuides from './getGuides.endpoint';
import deleteGuide from './deleteGuide.endpoint';
import { Application } from 'express';


export default (app: Application) => {
    addGuide(app);
    getGuide(app);
    getGuides(app);
    deleteGuide(app);
};