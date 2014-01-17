/*
 * User Schema tests
 */

var mongoose = require('mongoose')
  , SchemaTypes = mongoose.Schema.Types
  , User = mongoose.model('User')
  , should = require('should');

var Schema = User.schema;
var treeSize = 10;

describe('User Schema', function () {
  it('should have ' + treeSize + ' properties', function () {
    Object.keys(Schema.tree).length.should.equal(treeSize);
  });

  it('should have trimmed, required, string name property', function () {
    Schema.path('name').options.trim.should.be.true;
    Schema.path('name').options.required.should.be.true;
    Schema.path('name').options.type.should.be.equal(String);
  });

  it('should have trimmed, required, string username property', function () {
    Schema.path('username').options.trim.should.be.true;
    Schema.path('username').options.required.should.be.true;
    Schema.path('username').options.type.should.be.equal(String);
  });

  it('should have trimmed, required, string email property', function () {
    Schema.path('email').options.trim.should.be.true;
    Schema.path('email').options.required.should.be.true;
    Schema.path('email').options.type.should.be.equal(String);
  });

  it('should have trimmed, required, string hash property', function () {
    Schema.path('hash').options.trim.should.be.true;
    Schema.path('hash').options.required.should.be.true;
    Schema.path('hash').options.type.should.be.equal(String);
  });

  it('should have required, Array[String] accessTokens property', function () {
    Schema.path('accessTokens').should.be.instanceof(SchemaTypes.Array);
    Schema.path('accessTokens').options.type[0].should.be.equal(String);
    should.not.exist(Schema.path('accessTokens').options.default);
    should.not.exist(Schema.path('accessTokens').options.required);
  });

  describe('Virtuals', function () {
    it('should have password property', function () {
      should.exist(Schema.virtualpath('password'));
    });

    it('should have passwordConfirm property', function () {
      should.exist(Schema.virtualpath('passwordConfirm'));
    });
  });

  describe('Collection', function () {
    it('should be "users"', function () {
      User.collection.name.should.equal('users');
    });
  });
});
