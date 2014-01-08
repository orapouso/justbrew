var request = require('supertest')
  , env = process.env.NODE_ENV || 'test'
  , config = require('../../config/config')[env]
  , app = require('express')()
  , httpStatus = require('../../app/helpers/http-status')
  , passport = require('passport');

require('../../config/express')(app, config, passport);
require('../../config/routes')(app, passport);

describe('Home Controller', function () {
  it('on [ GET /login ] should return [ ' + httpStatus.OK + ' ' + httpStatus['200'] + ' ]', function (done) {
    request(app)
      .get('/login')
      .expect(httpStatus.OK, done);
  });

  it('on [ GET / ] without authentication should return [ ' + httpStatus.FOUND + ' ' + httpStatus['302'] + ' "Location":"/login?error=unauthorized" ]', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect(httpStatus.FOUND)
      .expect('Location', /\/login\?error=unauthorized/, done);
  });

  it('on [ GET / ] with invalid "Authorization" header/param should return [ ' + httpStatus.FOUND + ' ' + httpStatus['302'] + ' "Location":"/login?error=unauthorized" ]', function (done) {
    request(app)
      .get('/?Authorization=invalid_authorization')
      .set('Accept', 'text/html')
      .expect(httpStatus.FOUND)
      .expect('Location', /\/login\?error=unauthorized/, done);
  });
});