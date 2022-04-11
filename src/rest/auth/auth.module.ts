import login from './login.endpoint';
import singUp from './singUp.endpoint';
import isAuthenticated from './isAuthenticated.endpoint';
import { Application } from 'express';

export default (app: Application) => {
    login(app);
    singUp(app);
    isAuthenticated(app);
};