
var LocalStrategy = require('passport-local').Strategy
  , User = require('mongoose').model('User')
  , logger = require('../logger');

module.exports = function (passport) {

  // serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });

  // use local strategy
  passport.use(new LocalStrategy(
    function (username, password, done) {
      logger.log('info', 'New login attempt username=[%s]', username);
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          logger.log('info', 'User not found for username=[%s]', username);
          return done(null, false, { message: 'Usuário desconhecido' });
        }
        if (!user.authenticate(password)) {
          logger.log('warn', 'Invalid password %s', username);
          return done(null, false, { message: 'Senha inválida' });
        }
        logger.log('debug', 'Login attempt successfull %s', username);
        return done(null, user);
      });
    }
  ));
};