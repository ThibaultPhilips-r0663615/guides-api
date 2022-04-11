import getLog from './getLog.endpoint';
import getLogs from './getLogs.endpoint';
import { Application } from 'express';

export default (app: Application) => {
    getLog(app);
    getLogs(app);
};