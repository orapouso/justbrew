var request = require('supertest')
  , env = process.env.NODE_ENV || 'test'
  , config = require('../../config/config')[env]
  , app = require('express')()
  , httpStatus = require('../../app/helpers/http-status')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , should = require('should')
  , helper = require('../helper')
  , async = require('async');

// bootstrap passport config
require('../../config/passport')(passport, config);
require('../../config/express')(app, config, passport);
require('../../config/routes')(app, passport);

var api = '/api/authenticate';
describe('API ' + api, function () {
  var stubUser;
  var mongooseHelper = helper.mongoose(mongoose, config, 'authenticate', User);
  before(function (done) {
    mongooseHelper.stubUser(function (user) {
      stubUser = user;
      done();
    });
  });

  it('on [ POST "Accept":"application/json", missing/empty params and token ] should return [ ' + httpStatus.BAD_REQUEST + ' ' + httpStatus['400'] + ' ]', function (done) {
    async.parallel([
      function (callback) {
        request(app)
          .post(api)
          .set('Accept', 'application/json')
          .expect(httpStatus.BAD_REQUEST)
          .end(function (err, res) {
            res.body.errors.should.have.length(2);
            res.body.errors[0].error.should.equal('empty');
            res.body.errors[1].error.should.equal('empty');
            res.body.errors[0].field.should.equal('username');
            res.body.errors[1].field.should.equal('password');
            callback(err);
          });
      },
      function (callback) {
        request(app)
          .post(api)
          .set('Accept', 'application/json')
          .send({username: '', password: ''})
          .expect(httpStatus.BAD_REQUEST)
          .end(function (err, res) {
            res.body.errors.should.have.length(2);
            res.body.errors[0].error.should.equal('empty');
            res.body.errors[1].error.should.equal('empty');
            res.body.errors[0].field.should.equal('username');
            res.body.errors[1].field.should.equal('password');
            callback(err);
          });
      },
      function (callback) {
        request(app)
          .post(api)
          .set('Accept', 'application/json')
          .send({username: 'username', password: ''})
          .expect(httpStatus.BAD_REQUEST)
          .end(function (err, res) {
            res.body.errors.should.have.length(1);
            res.body.errors[0].error.should.equal('empty');
            res.body.errors[0].field.should.equal('password');
            callback(err);
          });
      },
      function (callback) {
        request(app)
          .post(api)
          .set('Accept', 'application/json')
          .send({username: '', password: 'password'})
          .expect(httpStatus.BAD_REQUEST)
          .end(function (err, res) {
            res.body.errors.should.have.length(1);
            res.body.errors[0].error.should.equal('empty');
            res.body.errors[0].field.should.equal('username');
            callback(err);
          });
      }
    ], function (err) {
      done(err);
    });
  });

  it('on [ POST "Accept":"text/html", missing/empty params and token ] should return [ ' + httpStatus.BAD_REQUEST + ' ' + httpStatus['400'] + ' ]', function (done) {
    async.parallel([
      function (callback) {
        request(app)
          .post(api)
          .set('Accept', 'text/html')
          .expect(httpStatus.BAD_REQUEST)
          .expect('Content-Type', /application\/json/, callback);
      },
      function (callback) {
        request(app)
          .post(api)
          .set('Accept', 'text/html')
          .send({username: '', password: ''})
          .expect(httpStatus.BAD_REQUEST)
          .expect('Content-Type', /application\/json/, callback);
      },
      function (callback) {
        request(app)
          .post(api)
          .set('Accept', 'text/html')
          .send({username: 'username', password: ''})
          .expect(httpStatus.BAD_REQUEST)
          .expect('Content-Type', /application\/json/, callback);
      },
      function (callback) {
        request(app)
          .post(api)
          .set('Accept', 'text/html')
          .send({username: '', password: 'password'})
          .expect(httpStatus.BAD_REQUEST)
          .expect('Content-Type', /application\/json/, callback);
      }
    ], function (err) {
      done(err);
    });
  });

  it('on [ POST "Accept":"application/json", wrong username/password ] should return [ ' + httpStatus.UNAUTHORIZED + ' ' + httpStatus['401'] + ' ]', function (done) {
    request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send({username: 'wrong', password: 'wrong'})
      .expect(httpStatus.UNAUTHORIZED, done);
  });

  it('on [ POST "Accept":"text/html", wrong username/password ] should return [ ' + httpStatus.UNAUTHORIZED + ' ' + httpStatus['401'] + ' "Location":"/login?error=unauthorized" ]', function (done) {
    request(app)
      .post(api)
      .set('Accept', 'text/html')
      .send({username: 'wrong', password: 'wrong'})
      .expect(httpStatus.UNAUTHORIZED, done);
  });

  it('on [ POST "Accept":"application/json", correct username/password ] should return [ ' + httpStatus.OK + ' ' + httpStatus['200'] + ' ]', function (done) {
    request(app)
      .post(api)
      .set('Accept', 'application/json')
      .send({ username: stubUser.username, password: stubUser.password })
      .expect(httpStatus.OK)
      .expect('Content-type', /application\/json/)
      .end(function (err, res) {
        should.not.exist(err);
        stubUser.accessTokens.push(res.body.accessToken);

        res.body.user.should.have.property('id');
        res.body.user.should.have.property('name');
        res.body.user.should.have.property('username');
        res.body.user.should.have.property('email');
        res.body.user.should.not.have.property('hash');
        res.body.user.should.not.have.property('password');
        res.body.accessToken.should.be.ok;
        res.body.accessToken.indexOf('Justbrew').should.be.equal(-1);

        done();
      });
  });

  it('on [ POST "Accept":"text/html", correct username/password ] should return [ ' + httpStatus.FOUND + ' ' + httpStatus['302'] + ' "Location":"/?Authorization" ]', function (done) {
    request(app)
      .post(api)
      .set('Accept', 'text/html')
      .send({ username: 'valid_username', password: 'valid_password' })
      .expect(httpStatus.FOUND)
      .expect('Location', /\/\?Authorization/)
      .end(function (err, res) {
        should.not.exist(err);
        should.not.exist(res.body.accessToken);

        var accessToken = res.headers['location'].split('/?Authorization=')[1];
        stubUser.accessTokens.push(accessToken);
        done();
      });
  });

  it('on [ POST only invalid accessToken ] should return [ ' + httpStatus.UNAUTHORIZED + ' ' + httpStatus['401'] + ' ]', function (done) {
    request(app)
      .post(api)
      .set('Accept', 'application/json')
      .set('Authorization', 'invalid_authorization')
      .expect(httpStatus.UNAUTHORIZED, done);
  });

  it('on [ POST only valid accessToken ] should return [ ' + httpStatus.OK + ' ' + httpStatus['200'] + ' ]', function (done) {
    request(app)
      .post(api)
      .set('Accept', 'application/json')
      .set('Authorization', stubUser.accessTokens[0])
      .expect(httpStatus.OK)
      .expect('Content-type', /application\/json/)
      .end(function (err, res) {
        should.not.exist(err);
        res.body.user.should.have.property('id');
        res.body.user.should.have.property('name');
        res.body.user.should.have.property('username');
        res.body.user.should.have.property('email');
        res.body.user.should.not.have.property('hash');
        res.body.user.should.not.have.property('password');
        res.body.accessToken.should.be.ok;
        res.body.accessToken.indexOf('Justbrew').should.be.equal(-1);

        done();
      });
  });
});