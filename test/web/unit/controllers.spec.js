/*global describe, it, expect, module, angular, document, waits, runs */

describe('Justbrew Controllers:', function () {
  'use strict';

  beforeEach(module('justbrew'));

  var $s, $c, $api;
  beforeEach(inject(function ($rootScope, $controller, apiVersion) {
    $s = $rootScope.$new();
    $c = $controller;
    $api = '/' + apiVersion;
  }));

  function createController(ctrl, inject) {
    return $c(ctrl, angular.extend({$scope: $s}, inject || {}));
  }

  describe('MainCtrl:', function () {
    var $rs, $hb;
    beforeEach(inject(function ($resource, $httpBackend) {
      $rs = $resource;
      $hb = $httpBackend;
    }));

    it('should exist', function () {
      var ctrl = createController('MainCtrl', {$resource: $rs});
      expect(ctrl).toBeDefined();
    });
  });

  describe('HomeCtrl:', function () {
    var $hb, $f;
    beforeEach(inject(function ($httpBackend, $filter) {
      $hb = $httpBackend;
      $f = $filter;
    }));

    it('should have a HomeCtrl', function () {
      var ctrl = createController('HomeCtrl');
      expect(ctrl).toBeDefined();
    });
  });
});
