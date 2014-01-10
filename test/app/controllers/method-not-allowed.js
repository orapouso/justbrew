var ROOT = process.env.ROOT
  , request = require('supertest')
  , env = process.env.NODE_ENV || 'test'
  , config = require(ROOT + '/app/config/config')[env]
  , app = require('express')()
  , passport = require('passport')
  , httpStatus = require(ROOT + '/app/helpers/http-status')
  , async = require('async');

app.use(function (req, res, next) {
  req.user = {
    hasAccessToken: function () { return true; }
  };
  next();
});

require(ROOT + '/app/config/express')(app, config, passport);
require(ROOT + '/app/config/routes')(app, config, passport);

var methods = ['get', 'post', 'put', 'del'];
var apis = [{
  url: '/api/authenticate',
  allowed: ['post']
}];

describe('API Method Not Allowed [405]', function () {

  apis.forEach(function (api) {
    var notAllowed = methods.slice();
    api.allowed.forEach(function (meth) {
      var index = notAllowed.indexOf(meth);
      if (index > -1) {
        notAllowed.splice(index, 1);
      }
    });

    it('on [ ' + notAllowed.join(', ').toUpperCase() + ' ' + api.url + ' ] should return [ ' +
    httpStatus.METHOD_NOT_ALLOWED + ' ' + httpStatus['405'] + ' "Allow": "' +
    api.allowed.join(', ').toUpperCase() + '" ]', function (done) {
      var checkNotAllowed = function (method, callback) {
        request(app)[method](api.url)
          .set('Authorization', 'token')
          .expect(httpStatus.METHOD_NOT_ALLOWED)
          .expect('Allow', /.*/)
          .end(function (err, res) {
            var allow = (res.header.allow + '').toLowerCase();
            var regexp = new RegExp(api.allowed.join('|'), 'g');
            regexp.test(allow).should.be.true;
            allow.match(regexp).length.should.equal(api.allowed.length);
            callback(err);
          });
      };

      var parallel = [];
      notAllowed.forEach(function (method) {
        parallel.push(function (callback) {
          checkNotAllowed(method, callback);
        });
      });

      async.parallel(parallel, function (err) {
        done(err);
      });
    });
  });
});
