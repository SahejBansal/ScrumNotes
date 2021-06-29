const controller= require('../controller/controller')

module.exports = function(app){
    app.post('/createClient', controller.saveInDB);
    app.post('/createToken', controller.TokenGen);
}