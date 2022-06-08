import login from './login.endpoint';
import singUp from './singUp.endpoint';
import isAuthenticated from './isAuthenticated.endpoint';
import { Application } from 'express';
import getUser from './getUser.endpoint'
import verifyRefreshAccessToken from './verifyRefreshAccessToken.endpoint'

export default (app: Application) => {
    login(app);
    singUp(app);
    isAuthenticated(app);
    getUser(app);
    verifyRefreshAccessToken(app)
};