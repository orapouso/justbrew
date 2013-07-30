/**
 * Module dependencies
 */

var httpStatus = require('../helpers/http-status')
  , User = require('mongoose').model('User')
  , logger = require('../../logger');

exports.login = function (req, res) {
  res.render('users/login', {title: 'login'});
};

exports.checkAuth = function (req, res, next) {
  var errors = [];

  ['username', 'password'].forEach(function (prop) {
    if (!req.body[prop] || req.body[prop].trim() === '') {
      errors.push({
        error: 'empty',
        expected: 'not empty',
        value: req.body[prop] || '',
        field: prop,
        msg: prop + ' field is empty'
      });
    }
  });

  if (errors.length > 0) {
    return checkAccessTokenAuth(req, res, function () {
      res.send(httpStatus.BAD_REQUEST, { errors: errors });
    });
  }

  next();
};

function checkAccessTokenAuth(req, res, next) {
  var accessToken = req.get('Authorization') || req.query.Authorization;
  if (accessToken && accessToken !== '') {
    logger.log('info', 'Trying authentication with accessToken=[%s]', accessToken);
    User.findByAccessToken(accessToken, function (err, user) {
      if (user && user.hasAccessToken(accessToken)) {
        logger.log('info', 'Access token authentication successful for user=[%s]', user.username);
        req.accessToken = accessToken.replace('Justbrew ', '');
        req.user = user;
        return authenticate(req, res, next); //valid access token
      }
      logger.log('warn', 'Access token authentication invalid for token=[%s]', accessToken);
      return res.send(httpStatus.UNAUTHORIZED); //invalid access token
    });
    return;
  }

  next();
}

function authenticate(req, res) {
  var accessToken = req.accessToken || req.user.newAccessToken();

  var user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    username: req.user.username
  };

  var ret = { user: user, accessToken: accessToken };
  res.format({
    html: function () {
      return res.redirect('/?Authorization=' + accessToken);
    },
    json: function () {
      return res.json(httpStatus.OK, ret);
    }
  });
}

exports.authenticate = authenticate;