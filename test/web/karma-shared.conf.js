var shared = function (config) {
  config.set({
    basePath: '../../',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: true,

    // these are default values anyway]
    singleRun: false,
    colors: true,
    preprocessors: {
      'src/web/templates/**/*.html': [ 'ng-html2js' ]
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/web/',
      prependPrefix: '/public/'
    }
  });
};

shared.files = [
  'src/web/components/angular/angular.js',
  'src/web/components/angular-resource/angular-resource.js',
  'src/web/components/angular-cookies/angular-cookies.js',
  'src/web/components/angular-route/angular-route.js',
  'src/web/components/angular-bootstrap/ui-bootstrap-tpls.js',
  'src/web/scripts/*.js',
  'src/web/templates/**/*.html'
];

module.exports = shared;
