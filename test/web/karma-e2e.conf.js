// Karma e2e configuration

var shared = require('./karma-shared.conf.js');

module.exports = function (config) {
  shared(config);

  config.set({
    frameworks: ['ng-scenario'],
    files: ['test/web/e2e/**/*.js'],
    urlRoot: '/_karma_/',
    proxies: {
      '/': 'http://localhost:4000/',
      '/public': 'http://localhost:4000/public'
    }
  });
};
