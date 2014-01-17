(function (global) {
  'use strict';

  var app = global.Justbrew = angular.module('justbrew', ['ngResource', 'ngCookies', 'ngRoute', 'util', 'ui.bootstrap', 'ui.templates']);

  app.value('apiVersion', 'v1');
})(this);

