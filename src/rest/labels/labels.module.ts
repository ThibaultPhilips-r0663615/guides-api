module.exports = (app: any) => {
    require('./addLabel.endpoint')(app)
    require('./getLabel.endpoint')(app)
    require('./getLabels.endpoint')(app)
    require('./updateLabel.endpoint')(app)
    require('./deleteLabel.endpoint')(app)
};