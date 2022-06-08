import addALaCarteWalk from './addALaCarteWalk.endpoint';
import getALaCarteWalk from './getALaCarteWalk.endpoint';
import getALaCarteWalks from './getALaCarteWalks.endpoint';
import deleteALaCarteWalk from './deleteALaCarteWalk.endpoint';
import { Application } from 'express';
import editALaCarteWalk from './editALaCarteWalk.endpoint';


export default (app: Application) => {
    addALaCarteWalk(app);
    getALaCarteWalk(app);
    getALaCarteWalks(app);
    deleteALaCarteWalk(app);
    editALaCarteWalk(app);
};