var userConfig = JSON.parse(JSON.stringify(require('../../user-config')))
  , config = require('../../config/config');

var prodKeys = Object.keys(config.production)
  , devKeys = Object.keys(config.development)
  , testKeys = Object.keys(config.test)
  , userDevKeys = Object.keys(userConfig.development)
  , userTestKeys = Object.keys(userConfig.test);

var count = userDevKeys.length;
var doneAll = function (done) {
  count--;
  if (count === 0) {
    return done();
  }
};

var shouldDeepEqual = function (source, value, done) {
  if (source === Object(source)) {
    var keys = Object.keys(source);
    count += keys.length;
    for (var i = 0; i < keys.length; i++) {
      shouldDeepEqual(source[keys[i]], value[keys[i]], done);
    }
  } else {
    source.should.equal(value);
  }
  doneAll(done);
};

describe('Internal Configuration', function () {
  describe('Development Environment', function () {
    it('should have same length of production properties',  function () {
      devKeys.should.have.length(prodKeys.length);
    });

    it('should mantain own properties', function (done) {
      count = userDevKeys.length;
      for (var i = 0; i < userDevKeys.length; i++) {
        shouldDeepEqual(userConfig.development[userDevKeys[i]], config.development[userDevKeys[i]], done);
      }
    });
  });

  describe('Test Environment', function () {
    it('should have same or more properties than production', function () {
      testKeys.length.should.be.above(prodKeys.length - 1);
    });

    it('should mantain own properties', function (done) {
      count = userTestKeys.length;
      for (var i = 0; i < userTestKeys.length; i++) {
        shouldDeepEqual(userConfig.test[userTestKeys[i]], config.test[userTestKeys[i]], done);
      }
    });
  });
});