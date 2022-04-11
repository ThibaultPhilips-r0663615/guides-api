import addLabel from './addLabel.endpoint';
import getLabel from './getLabel.endpoint';
import getLabels from './getLabels.endpoint';
import updateLabel from './updateLabel.endpoint';
import deleteLabel from './deleteLabel.endpoint';
import { Application } from 'express';

export default (app: Application) => {
    addLabel(app);
    getLabel(app);
    getLabels(app);
    updateLabel(app);
    deleteLabel(app);
};