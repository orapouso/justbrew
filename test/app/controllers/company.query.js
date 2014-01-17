var ROOT = process.env.ROOT
  , request = require('supertest')
  , env = process.env.NODE_ENV || 'test'
  , config = require(ROOT + '/app/config/config')[env]
  , app = require('express')()
  , HTTP_STATUS = require(ROOT + '/app/helpers/http-status')
  , mongoose = require('mongoose')
  , Company = mongoose.model('Company')
  , passport = require('passport')
  , should = require('should');

var loggedIn = false;
app.use(function (req, res, next) {
  req.user = {
    _id: '518d3bed82cc75c105000006',
    username: 'username1',
    hasAccessToken: function () { return loggedIn; }
  };

  next();
});

require(ROOT + '/app/config/express')(app, config, passport);
require(ROOT + '/app/config/routes')(app, config, passport);

var apiTemplate = '/api/companies';
describe('API GET ' + apiTemplate, function () {
  var oldFind, company;
  before(function () {
    oldFind = Company.find;
    Company.find = function (callback) {
      callback(null, [company]);
    };

    company = new Company({
      name: 'name1'
    });
  });

  after(function () {
    Company.find = oldFind;
  });

  var api = apiTemplate;
  it('on [ GET ] without authentication should return [ ' + HTTP_STATUS.UNAUTHORIZED + ' ' + HTTP_STATUS['401'] + ' ]', function (done) {
    request(app)
      .get(api)
      .set('Accept', 'application/json')
      .expect(HTTP_STATUS.UNAUTHORIZED)
      .expect('Content-type', /application\/json/, done);
  });

  it('on [ GET ] with authentication should return [ ' + HTTP_STATUS.OK + ' ' + HTTP_STATUS['200'] + ' ]', function (done) {
    loggedIn = true;

    request(app)
      .get(api)
      .set('Accept', 'application/json')
      .set('Authorization', 'valid_authorization')
      .expect(HTTP_STATUS.OK)
      .expect('Content-type', /application\/json/)
      .end(function (err, res) {
        should.not.exist(err);
        res.body.should.have.length(1);
        res.body[0].name.should.equal('name1');
        done();
      });
  });
});
