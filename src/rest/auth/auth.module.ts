module.exports = (app: any) => {
    require('./login.endpoint')(app)
    require('./singUp.endpoint')(app)
    require('./isAuthenticated')(app)
};