const controller= require('../controller/controller')

module.exports = function(app){
    app.post('/createClient', controller.saveInDB);
    app.post('/registerUser', controller.RegisterUser);
    app.post('/createGroup', controller.createGroup);
    app.post('/createPad', controller.createPad);
    app.post('/directToPad', controller.directToPad);
    app.get('/openPad', controller.getPadUrl);
}