(function () {
  'use strict';

  Array.prototype.clear = function () {
    while (this.length) {
      this.pop();
    }
  };

  Array.prototype.toggle = function (value) {
    var i;
    if ((i = this.indexOf(value)) > -1) {
      this.splice(i, 1);
    } else {
      this.push(value);
    }
  };

  Array.prototype.has = function (value) {
    return this.indexOf(value) > -1;
  };

  angular.module('util', ['ngResource'])
    .config(['$httpProvider',
      function ($httpProvider) {
        var logsOutUserOn401 = ['$q',
          function ($q) {
            var success = function (response) {
              return response;
            };

            var error = function (response) {
              switch (response.status) {
                case 401:
                  //redirect them back to login page
                  window.location = '/login';
                  return $q.reject(response);
                default:
                  return $q.reject(response);
              }
            };

            return function (promise) {
              return promise.then(success, error);
            };
          }
        ];

        $httpProvider.defaults.useXDomain = true;
        $httpProvider.responseInterceptors.push(logsOutUserOn401);
      }
    ])
    .factory('$resourceV', ['$resource', '$injector',
      function ($resource, $injector) {
        var apiVersion = null;
        try {
          apiVersion = $injector.get('apiVersion');
        } catch (e) {}

        return function (url, paramsDefaults, actions) {
          paramsDefaults = paramsDefaults || {};
          if (angular.isDefined(apiVersion)) {
            url = '/:v' + url;

            paramsDefaults.v = paramsDefaults.v || apiVersion;
          }

          return $resource(url, paramsDefaults, actions);
        };
      }
    ])
    .filter('range', function () {
      return function (input, total) {
        if (angular.isNumber(input)) {
          total = input;
          input = [];
        }
        total = parseInt(total, 10);
        for (var i = 0; i < total; i++) {
          input.push(i);
        }
        return input;
      };
    });
})();