
/**
 * Module dependencies.
 */

var authorization = require('../middlewares/authorization')
, validation = require('../middlewares/validation');

module.exports = function (app, config, passport) {

  function index(req, res) {
    res.status(200).sendfile(config.root + '/public/templates/index.html');
  }

  function login(req, res) {
    res.status(200).sendfile(config.root + '/public/templates/login.html');
  }

  app.get('/', index);
  app.get('/ingredients', index);
  app.get('/login', login);

  var users = require('../controllers/users');
  app.post('/api/authenticate', users.checkAuth, passport.authenticate('local'), users.authenticate);
  app.all('/api/authenticate', authorization.methodNotAllowed(['POST']));
};
