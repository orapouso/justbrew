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
        var logsOutUserOn401 = ['$q', function ($q) {
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
        }];

        $httpProvider.defaults.useXDomain = true;
        $httpProvider.responseInterceptors.push(logsOutUserOn401);
      }
    ])
    .factory('$resourceV', ['$resource', '$injector', function ($resource, $injector) {
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
    }])
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
    })
    .filter('timecode', ['$filter', function ($filter) {
      var FPS = {
        PAL: 25,
        NTSC: 30000 / 1001
      };

      function ldiv(numer, denom) {
        return {
          quot: parseInt(numer / denom, 10),
          rem: parseInt(numer % denom, 10)
        };
      }

      function framesToTimecode(input, dropFrame) {
        return dropFrame ? framesToTimecodeDf(input) : framesToTimecodeNdf(input);
      }

      function framesToTimecodeDf(input) {
        var r = [];
        r[0] = ldiv(input, 17982);
        r[1] = ldiv(r[0].quot, 6);
        r[2] = ldiv(r[0].rem - 2, 1798);
        r[3] = ldiv(r[2].rem + 2, 30);

        var h = r[1].quot * (60 * 60 * 1000);
        var m = (10 * r[1].rem + r[2].quot) * (60 * 1000);
        var s = r[3].quot * (1000);
        var f = r[3].rem;
        var d = new Date(h + m + s);
        d = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000));

        d.frame = f;
        return d;
      }

      function framesToTimecodeNdf(input) {
        var r = [];
        r[0] = ldiv(input, 60 * 60 * 30);
        r[1] = ldiv(r[0].rem, 60 * 30);
        r[2] = ldiv(r[1].rem, 30);

        var h = r[0].quot * (60 * 60 * 1000);
        var m = r[1].quot * (60 * 1000);
        var s = r[2].quot * (1000);
        var f  = r[2].rem;
        var d = new Date(h + m + s);
        d = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000));

        d.frame = f;
        return d;
      }

      function timecodeFilter(input, format, dropFrame) {
        input = input || 0;
        format = format || 'HH:mm:ss:ff';
        if (angular.isUndefined(dropFrame)) {
          dropFrame = true;
        }
        if (angular.isString(input)) {
          input = parseInt(input, 10) || 0;
        }

        if (format.indexOf('ff') > -1) {
          input = framesToTimecode(input, dropFrame);
          format = format.replace(/ff/, ('00' + input.frame).slice(-2));
        } else if (angular.isNumber(input)) {
          input = new Date(input);
          input = new Date(input.getTime() + (input.getTimezoneOffset() * 60 * 1000))
        }

        var ret = $filter('date')(input, format);

        return ret;
      }

      timecodeFilter.FPS = FPS;
      return timecodeFilter;
    }]);
})();
