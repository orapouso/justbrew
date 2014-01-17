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

var apiTemplate = '/api/company';
describe('API POST ' + apiTemplate, function () {
  var oldSave, company, companyId = '518d3bed82cc75c105000006';
  before(function () {
    oldSave = Company.prototype.save;
    Company.prototype.save = function (callback) {
      var self = this;
      self.validate(function (err) {
        callback(err, self);
      });
    };

    company = new Company({
      name: 'name1'
    });
  });

  after(function () {
    Company.prototype.save = oldSave;
  });

  var api = apiTemplate;
  it('on [ POST ] without authentication should return [ ' + HTTP_STATUS.UNAUTHORIZED + ' ' + HTTP_STATUS['401'] + ' ]', function (done) {
    request(app)
      .post(api)
      .set('Accept', 'application/json')
      .expect(HTTP_STATUS.UNAUTHORIZED)
      .expect('Content-type', /application\/json/, done);
  });

  it('on [ POST missing required / wrong params ] with authentication should return [ ' + HTTP_STATUS.BAD_REQUEST + ' ' + HTTP_STATUS['400'] + ' ]', function (done) {
    loggedIn = true;
    request(app)
      .post(api)
      .set('Accept', 'application/json')
      .set('Authorization', 'valid_authorization')
      .expect(HTTP_STATUS.BAD_REQUEST)
      .expect('Content-type', /application\/json/)
      .end(function (err, res) {
        should.not.exist(err);
        res.body.name.type.should.equal('required');
        done(err);
      });
  });

  it('on [ POST with required params] should return [ ' + HTTP_STATUS.OK + ' ' + HTTP_STATUS['200'] + ' ]', function (done) {
    loggedIn = true;
    request(app)
      .post(api)
      .set('Accept', 'application/json')
      .set('Authorization', 'valid_authorization')
      .send({
        name: 'name'
      })
      .expect(HTTP_STATUS.OK)
      .expect('Content-type', /application\/json/)
      .end(function (err, res) {
        should.not.exist(err);
        res.body._id.should.be.ok;
        done(err);
      });
  });
});
