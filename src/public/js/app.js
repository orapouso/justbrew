// -----------------------------------------------------------------------------
// Class object based on John Resigs code; inspired by base2 and Prototype
// http://ejohn.org/blog/simple-javascript-inheritance/
(function (global) {
  'use strict';

  var initializing = false,
    fnTest = /xyz/.test(function () {
      xyz;
    }) ? /\bparent\b/ : /.*/;

  global.Class = function () {};

  var inject = function (prop) {
    var proto = this.prototype;
    var parent = {};
    for (var name in prop) {
      if (typeof (prop[name]) === 'function' && typeof (proto[name]) === 'function' && fnTest.test(prop[name])) {
        parent[name] = proto[name]; // save original function
        proto[name] = (function (name, fn) {
          return function () {
            var tmp = this.parent;
            this.parent = parent[name];
            var ret = fn.apply(this, arguments);
            this.parent = tmp;
            return ret;
          };
        })(name, prop[name]);
      } else {
        proto[name] = prop[name];
      }
    }
  };

  var extend = function (prop) {
    var parent = this.prototype;

    initializing = true;
    var prototype = new this();
    initializing = false;

    for (var name in prop) {
      if (typeof (prop[name]) === 'function' && typeof (parent[name]) === 'function' && fnTest.test(prop[name])) {
        prototype[name] = (function (name, fn) {
          return function () {
            var tmp = this.parent;
            this.parent = parent[name];
            var ret = fn.apply(this, arguments);
            this.parent = tmp;
            return ret;
          };
        })(name, prop[name]);
      } else {
        prototype[name] = prop[name];
      }
    }

    function Class() {
      if (!initializing) {

        // If this class has a staticInstantiate method, invoke it
        // and check if we got something back. If not, the normal
        // constructor (init) is called.
        if (this.staticInstantiate) {
          var obj = this.staticInstantiate.apply(this, arguments);
          if (obj) {
            return obj;
          }
        }

        for (var p in this) {
          if (typeof (this[p]) == 'object') {
            this[p] = copy(this[p]); // deep copy!
          }
        }

        if (this.init) {
          this.init.apply(this, arguments);
        }
      }

      return this;
    }

    Class.prototype = prototype;
    Class.constructor = Class;
    Class.extend = extend;
    Class.inject = inject;

    return Class;
  };
  global.Class.extend = extend;

})(this);
;(function () {
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
;(function (angular) {
  'use strict';

  angular.module('ui.templates', ['template/popover/popover.html', 'template/modal/synopsis.html']);

  angular.module('template/popover/popover.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/popover/popover.html',
      '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n' +
      '  <div class="arrow"></div>\n' +
      '  <div class="popover-inner">\n' +
      '      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n' +
      '      <div class="popover-content" ng-bind="content"></div>\n' +
      '  </div>\n' +
      '</div>\n');
  }]);

  angular.module('template/modal/synopsis.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/modal/synopsis.html',
      '<div class="modal-synopsis">\n' +
      '  <div class="modal-header">\n' +
      '    <h3>Sinopse de {{title}}</h3>\n' +
      '  </div>\n' +
      '  <div class="modal-body">\n' +
      '    <ul>\n' +
      '      <li ng-repeat="item in items">{{item}}</li>\n' +
      '    </ul>\n' +
      '  </div>\n' +
      '  <div class="modal-footer">\n' +
      '    <button class="button blue" ng-click="$close()">OK</button>\n' +
      '  </div>\n' +
      '</div>\n');
  }]);
})(window.angular);

;(function (global) {
  'use strict';

  var app = global.Justbrew = angular.module('justbrew', ['ngResource', 'ngCookies', 'ngRoute', 'util', 'ui.bootstrap', 'ui.templates']);

  app.value('apiVersion', 'v1');
})(this);

;(function (app) {
  'use strict';
  var Ingredient = Class.extend({
    init: function () {}
  });

  app.Ingredient = Ingredient;

})(this.Justbrew);
;(function (app) {
  'use strict';

  app.controller('MainCtrl', ['$scope',
    function ($scope) {
    }
  ]);

  app.controller('HomeCtrl', ['$scope', '$resourceV',
    function ($scope, $resourceV) {
    }
  ]);

  app.controller('IngredientsCtrl', ['$scope', '$resourceV',
    function ($scope, $resourceV) {
    }
  ]);
})(this.Justbrew);
;(function (app) {
  'use strict';

  if (app === null || angular.isUndefined(app)) {
    throw 'Needs fucking app';
  }

  app.directive('infiniteScroll', ['$window', '$document', function ($window, $document) {
    return {
      link: function (scope, elem, attrs) {
        scrollElem = elem;
        elem = elem[0];
        var el = elem, scrollElem;
        if (attrs.$attr.infiniteWindow) {
          scrollElem = angular.element($window);
          el = $document[0].body;
        }

        var offset = 0;
        function setOffset() {
          offset = (parseFloat(attrs.infiniteThreshold, 10) || 1) * elem.offsetHeight;
        }

        scrollElem.bind('scroll', function () {
          if (!offset) {
            setOffset();
          }

          if (el.scrollTop + el.offsetHeight >= el.scrollHeight - offset) {
            scope.$apply(attrs.infiniteScroll);
          }
        });
      }
    };
  }]);

  app.directive('lazySrc', function () {
    return {
      link: function (scope, elem, attrs) {
        var lazyClass = attrs.lazyClass || 'lazy';
        var errorClass = attrs.lazyError || 'lazy-error';
        elem.addClass(lazyClass);

        var img = angular.element(document.createElement('img'));
        img.bind('load', function () {
          elem.attr('src', img.attr('src'));
          elem.removeClass(lazyClass);
        });
        img.bind('error', function () {
          elem.removeClass(lazyClass);
          elem.addClass(errorClass);
        });
        img.attr('src', attrs.lazySrc);
      }
    };
  });

})(this.Justbrew);
;(function (app) {
	'use strict';

	app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

		$locationProvider.html5Mode(true);

		$routeProvider
			.when('/ingredients', {templateUrl: '/static/templates/views/ingredients/index.html', controller: 'IngredientsCtrl'})
			.when('/', {templateUrl: '/static/templates/views/home/index.html', controller: 'HomeCtrl'})
			.otherwise({redirectTo: '/'});
	}]);

})(this.Justbrew);
