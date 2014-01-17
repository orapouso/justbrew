(function (app) {
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
