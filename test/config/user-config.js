var userConfig = require('../../user-config');

describe('User Configuration', function () {
  it('should have "development", "test" and "production" environments', function () {
    userConfig.development.should.be.ok;
    userConfig.test.should.be.ok;
    userConfig.production.should.be.ok;
  });

  describe('Production Environment', function () {
    var dirName = require('path').normalize(__dirname.replace('/test/config', '').replace('\\test\\config', ''));
    it('should have root to ' + dirName, function () {
      userConfig.production.root.should.equal(dirName);
    });

    it('should have app.name equal to "Justbrew"', function () {
      userConfig.production.app.name.should.equal('Justbrew');
    });

    it('should have app.port equal to 80', function () {
      userConfig.production.app.port.should.equal(80);
    });

    it('should have auth.saltSize between 8 and 12', function () {
      userConfig.production.auth.saltSize.should.be.within(8, 12);
    });

    it('should have auth.minPassword >= 8', function () {
      userConfig.production.auth.minPassword.should.be.above(7);
    });
  });

  describe('Development Environment', function () {
    it('should have app.port equal to 3000', function () {
      userConfig.development.app.port.should.equal(3000);
    });

    it('should have a development mongodb database', function () {
      userConfig.development.db.should.match(/mongodb:\/\//)
                           .and.should.not.equal(userConfig.production.db);
    });
  });

  describe('Test Environment', function () {
    it('should have a test mongodb database', function () {
      userConfig.test.db.should.match(/mongodb:\/\//)
                    .and.should.not.equal(userConfig.development.db)
                    .and.should.not.equal(userConfig.production.db);
    });

    it('should have clearCollectionsAfter property', function () {
      userConfig.test.should.have.property('clearCollectionsAfter');
    });
  });
});