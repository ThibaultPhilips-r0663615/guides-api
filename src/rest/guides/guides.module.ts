module.exports = (app: any) => {
    require('./addGuide.endpoint')(app)
    require('./getGuide.endpoint')(app)
    require('./getGuides.endpoint')(app)
    require('./deleteGuide.endpoint')(app)
};