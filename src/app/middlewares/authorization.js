/**
 * Module dependencies.
 */

var httpStatus = require('../helpers/http-status')
  , User = require('mongoose').model('User')
  , logger = require('../logger');

function respond(req, res, status) {
  res.format({
    html: function () {
      //if it is unauthorized, the user must try to login again
      if (status === httpStatus.UNAUTHORIZED) {
        return res.redirect('/login?error=' + httpStatus[status].toLowerCase());
      } else {//if it is forbidden, the user does not have the permission, so we render a no permission page
        return res.status(status).render(status + '', { title: 'Justbrew' });
      }
    },
    json: function () {
      return res.json(status, {});
    }
  });
  return;
}

exports.requiresAuth = function (req, res, next) {
  var authenticated = false;
  if (req.path.indexOf('authenticate') < 0 && req.path.indexOf('login') < 0) {
    var accessToken = req.get('Authorization') || req.query.Authorization || req.cookies.Authorization;

    if (accessToken && accessToken !== '') {
      if (req.user && req.user.hasAccessToken(accessToken)) { //user logged in an has accessToken
        authenticated = true;
      } else {
        User.findByAccessToken(accessToken, function (err, user) {
          if (user) {
            req.user = user;
            return next();
          }
          return respond(req, res, httpStatus.UNAUTHORIZED);
        });
        return;
      }
    }
  } else {
    authenticated = true;
  }

  if (authenticated) {
    return next();
  }
  return respond(req, res, httpStatus.UNAUTHORIZED);
};

exports.methodNotAllowed = function (allowedMethods) {
  return function (req, res) {
    res.set('Allow', allowedMethods.join(', '));
    res.send(httpStatus.METHOD_NOT_ALLOWED);
  };
};
