
/**
 * Module dependencies.
 */

var authorization = require('../app/middlewares/authorization')
, validation = require('../app/middlewares/validation');

module.exports = function (app, passport) {

  var home = require('../app/controllers/home');
  app.get('/', home.index);
  app.get('/login', home.login);

  var users = require('../app/controllers/users');
  app.post('/api/authenticate', users.checkAuth, passport.authenticate('local'), users.authenticate);
  app.all('/api/authenticate', authorization.methodNotAllowed(['POST']));

  var ingredients = require('../app/controllers/ingredients');
  app.get('/ingredients', ingredients.index);
};