(function (angular) {
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

