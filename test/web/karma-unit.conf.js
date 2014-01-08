// Karma configuration

var shared = require('./karma-shared.conf.js');

module.exports = function (config) {
  shared(config);

  config.files = shared.files.concat([
    'src/web/components/angular-mocks/index.js',
    'test/web/helper.js',
    'test/web/unit/*.spec.js'
  ]);

  config.browsers = ['PhantomJS'];
};
