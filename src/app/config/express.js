
/**
 * Module dependencies.
 */

var express = require('express')
  , MongoStore = require('connect-mongo')(express)
  , helpers = require('../helpers/view')
  , httpStatus = require('../helpers/http-status')
  , auth = require('../middlewares/authorization')
  , logger = require('../logger');

module.exports = function (app, config, passport) {
  app.set('showStackError', true);
  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  app.use(express.static(config.root + '/public'));
  if (config.accessLog) {
    app.use(express.logger('dev'));
  }

  app.configure(function () {
    // dynamic helpers
    app.use(helpers(config));

    // bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // cookieParser should be above session
    app.use(express.cookieParser());
    //Mostly for testing, never for production code
    if (config.useMemorySessionStore) {
      app.use(express.session({ secret: config.sessionSecret }));
    } else {
      app.use(express.session({
        secret: config.sessionSecret,
        store: new MongoStore({
          url: config.db,
          collection : 'sessions'
        })
      }));
    }

    if (passport) {
      //app.use(passport.initialize());
      //app.use(passport.session());
    }

    if (config.accessControl) {
      app.use(function (req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'Authorization, X-Requested-With');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Control-Max-Age', '3600');
        if ('OPTIONS' === req.method) { return res.send(200); }
        next();
      });
    }

    //app.use(auth.requiresAuth);

    // routes should be at the last
    app.use(app.router);

    // use express favicon
    //app.use(express.favicon(config.root + '/public/images/favicon.ico'));

    // custom error handler
    app.use(function (err, req, res, next) {
      if (err.message.indexOf('not found') > -1) {
        return next();
      }
      console.error(err);
      logger.log('error', 'UNCAUGHT EXCEPTION: %j', err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).sendfile(config.root + '/public/templates/500.html');
    });

    app.use(function (req, res) {
      res.status(httpStatus.NOT_FOUND).sendfile(config.root + '/public/templates/404.html');
    });

  });
};
