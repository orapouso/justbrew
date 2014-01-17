/*global describe, it, expect, module, angular, waits, runs */

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

  describe('CompaniesCtrl:', function () {
    var $hb, $f;
    beforeEach(inject(function ($httpBackend, $filter) {
      $hb = $httpBackend;
      $f = $filter;
    }));

    it('should have a CompaniesCtrl', function () {
      var ctrl = createController('CompaniesCtrl');
      expect(ctrl).toBeDefined();
    });

    it('should request CompaniesRes GET method', function () {
      var res = { result: [] };
      $hb.expectGET('/api/companies').respond(200, res);
      createController('CompaniesCtrl');
      $hb.flush();
    });
  });


  describe('CompanyCtrl:', function () {
    var $hb, $f;
    beforeEach(inject(function ($httpBackend, $filter) {
      $hb = $httpBackend;
      $f = $filter;
    }));

    it('should have a CompanyCtrl', function () {
      var ctrl = createController('CompanyCtrl');
      expect(ctrl).toBeDefined();
    });

    it('should not request CompanyRes GET method if id param is not provided', function () {
      createController('CompanyCtrl');
      $hb.verifyNoOutstandingRequest();
    });

    it('should not request CompanyRes GET method if id param is provided', function () {
      var id = 1;
      var res = { result: { id: id} };
      $hb.expectGET('/api/company/' + id).respond(200, res);
      createController('CompanyCtrl', {$routeParams: {id: id} });
      $hb.flush();

      id = 'asdlkj123123098usdflskdf';
      $hb.expectGET('/api/company/' + id).respond(200, res);
      createController('CompanyCtrl', {$routeParams: {id: id} });
      $hb.flush();
    });
  });

  describe('IngredientsCtrl:', function () {
    var $hb, $f;
    beforeEach(inject(function ($httpBackend, $filter) {
      $hb = $httpBackend;
      $f = $filter;
    }));

    it('should have a IngredientsCtrl', function () {
      var ctrl = createController('IngredientsCtrl');
      expect(ctrl).toBeDefined();
    });

    it('should request IngredientsRes GET method', function () {
      var res = { result: [] };
      $hb.expectGET('/api/ingredients').respond(200, res);
      createController('IngredientsCtrl');
      $hb.flush();
    });
  });


  describe('IngredientCtrl:', function () {
    var $hb, $f;
    beforeEach(inject(function ($httpBackend, $filter) {
      $hb = $httpBackend;
      $f = $filter;
    }));

    it('should have a IngredientCtrl', inject(function (Ingredient) {
      var ctrl = createController('IngredientCtrl');
      expect(ctrl).toBeDefined();
      expect($s.types).toEqual(Ingredient.$types);
    }));

    it('should not request IngredientRes GET method if id param is not provided', function () {
      createController('IngredientCtrl');
      $hb.verifyNoOutstandingRequest();
    });

    it('should not request IngredientRes GET method if id param is provided', function () {
      var id = 1;
      var res = { result: { id: id} };
      $hb.expectGET('/api/ingredient/' + id).respond(200, res);
      createController('IngredientCtrl', {$routeParams: {id: id} });
      $hb.flush();

      id = 'asdlkj123123098usdflskdf';
      $hb.expectGET('/api/ingredient/' + id).respond(200, res);
      createController('IngredientCtrl', {$routeParams: {id: id} });
      $hb.flush();
    });
  });

});
