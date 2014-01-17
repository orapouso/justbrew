(function () {
  'use strict';

  angular.module('pica-login', ['ngCookies'])
    .controller('LoginController', ['$scope', '$cookieStore', function ($scope, $cookieStore) {
      $scope.login = function ($ev) {
        $cookieStore.put('user', $scope.user || $ev.target.form.login.value);
      };
    }]);
})();
