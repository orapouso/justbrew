describe('$resourceV service', function () {

  describe('as a $resource service', function () {
    angular.module('testResource', ['util']);

    beforeEach(module('testResource'));

    it('should act as a normal $resource service if no apiVersion is defined', inject(function ($resourceV, $httpBackend) {
      $httpBackend.expectGET('/test').respond(200);
      $resourceV('/test').get();
      $httpBackend.flush();
    }));

    it('should prepend custom version option "v" if provided', inject(function ($resourceV, $httpBackend) {
      $httpBackend.expectGET('/customv1/test').respond(200);
      $resourceV('/test', { v: 'customv1'}).get();
      $httpBackend.flush();
    }));

    it('should add other parameters normally', inject(function ($resourceV, $httpBackend) {
      $httpBackend.expectGET('/other/test?param=eter').respond(200);
      $resourceV('/:other/test', { other: 'other', param: 'eter'}).get();
      $httpBackend.flush();
    }));

    it('should prepend custom version paramenter and add other parameters normally', inject(function ($resourceV, $httpBackend) {
      $httpBackend.expectGET('/customv2/other/test?param=eter').respond(200);
      $resourceV('/:other/test', { v: 'customv2', other: 'other', param: 'eter'}).get();
      $httpBackend.flush();
    }));

    it('should accept custom actions', inject(function ($resourceV, $httpBackend) {
      $httpBackend.expectGET('/test?custom=true').respond(200);
      $resourceV('/test', {}, { test: { method: 'GET', params: { custom: true} } }).test();
      $httpBackend.flush();
    }));
  });

  describe('with apiVersion', function () {
    angular.module('testResourceV', ['util'])
      .value('apiVersion', 'testv1');

    beforeEach(module('testResourceV'));

    it('should prepend "apiVersion" to resource url', inject(function ($resourceV, $httpBackend) {
      $httpBackend.expectGET('/testv1/test').respond(200);
      $resourceV('/test').get();
      $httpBackend.flush();
    }));

    it('should override apiVersion with "v" option if provided', inject(function ($resourceV, $httpBackend) {
      $httpBackend.expectGET('/customv1/test').respond(200);
      $resourceV('/test', { v: 'customv1'}).get();
      $httpBackend.flush();
    }));
  });
});

