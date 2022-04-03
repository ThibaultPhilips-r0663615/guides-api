module.exports = (app: any) => {
    require('./getLog.endpoint')(app)
    require('./getLogs.endpoint')(app)
};