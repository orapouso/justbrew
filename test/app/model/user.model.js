/*
 * User Model tests
 */

var ROOT = process.env.ROOT
  , mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'test'
  , config = require(ROOT + '/app/config/config')[env]
  , User = mongoose.model('User')
  , should = require('should')
  , crypto = require('crypto');

describe('User Model', function () {
  require('../helper').mongoose(mongoose, config, 'user', User);

  var user = new User({
    name: 'User1',
    email: 'invalid.email',
    username: 'username1',
    password: 'invalid',
    passwordConfirm: 'nomatch',
    telephone: 'telephone1',
    permissions: []
  });

  var validPassword = 'valid-password1';
  var validEmail = 'valid@ema.il';

  it('should reject invalid emails', function (done) {
    var invalidEmails = ['invalid.email', 'invalid@email', 'invalid@email.com@invalid', 'invalid@email.com.c', 'invalid@gmail.c'];

    var completed = 0;
    function validated() {
      completed++;
      if (completed >= invalidEmails.length) {
        done();
      }
    }

    invalidEmails.forEach(function (email) {
      user.email = email;
      user.validate(function (err) {
        should.exist(err);
        err.errors.should.have.property('email');
        validated();
      });
    });
  });

  it('should reject invalid password', function (done) {
    user.save(function (err) {
      should.exist(err);
      err.errors.should.have.property('password');
      done();
    });
  });

  it('should reject unmatched passwordConfirm', function (done) {
    user.password = validPassword;
    user.save(function (err) {
      should.exist(err);
      err.errors.should.not.have.property('password');
      err.errors.should.have.property('passwordConfirm');
      done();
    });
  });

  it('should encrypt password with crypto encryption', function () {
    var user2 = new User({
      password: validPassword
    });

    user.hash.should.not.equal(user2.hash);
    var salt = user.hash.split('::')[0];
    var hash = salt + '::' + crypto.pbkdf2Sync(validPassword, salt, config.auth.iterations, 2^config.auth.saltSize).toString('base64')
    hash.should.equal(user.hash);
  });

  it('should authenticate with right password', function () {
    user.authenticate(validPassword).should.be.true;
  });

  it('should NOT authenticate with wrong password', function () {
    user.authenticate('wrong-password').should.be.false;
  });

  it('should save new document', function (done) {
    user.password = user.passwordConfirm = validPassword;
    user.email = validEmail;

    user.save(function (err) {
      should.not.exist(err);
      done();
    });
  });

  it('should be able to add access tokens', function (done) {
    User.findById(user.id, function (err, user2) {
      should.not.exist(err);

      user2.accessTokens.push('new accessTokens');

      user2.save(function (err, user3) {
        should.not.exist(err);
        user3.accessTokens.length.should.equal(1);
        user3.accessTokens[0].should.equal('new accessTokens');
        done();
      });
    });
  });

  it('should be able to remove access tokens', function (done) {
    User.findById(user.id, function (err, user2) {
      should.not.exist(err);

      user2.accessTokens.pop();

      user2.save(function (err, user3) {
        should.not.exist(err);
        user3.accessTokens.length.should.equal(0);
        done();
      });
    });
  });

  it('should find previously created document', function (done) {
    User.findOne({name: 'User1'}, function (err, user2) {
      should.not.exist(err);
      user2.name.should.equal(user.name);
      user2.email.should.equal(user.email);

      User.findById(user.id, function (err, user3) {
        should.not.exist(err);
        user3.name.should.equal(user.name);
        user3.email.should.equal(user.email);
        done();
      });
    });
  });

  it('should update previously created document', function (done) {
    user.name = 'UserNovo1';
    user.save(function (err) {
      should.not.exist(err);

      User.findOne({name: 'User1'}, function (err, user2) {
        should.not.exist(err);
        should.not.exist(user2);
        done();
      });
    });
  });

  it('should remove the document', function (done) {
    user.remove(function (err) {
      should.not.exist(err);
      User.findById(user.id, function (err, user2) {
        should.not.exist(err);
        should.not.exist(user2);
        done();
      });
    });
  });
});
