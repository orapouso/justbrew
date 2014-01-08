/*global describe, it, expect, module, angular, document, waits, runs */

describe('Justbrew app', function () {
  var deps = ['ngResource', 'ngCookies', 'ngRoute', 'util', 'ui.bootstrap', 'ui.templates'];

  beforeEach(module('justbrew'));

	it('should have "' + deps.join(', ') + '" dependencies', function () {
		var module = angular.module('justbrew');
		var requires = module.value('appName').requires;

		expect(requires.length).toBe(deps.length);

    deps.forEach(function (dep) {
      expect(requires).toContain(dep);
    });
	});

  it('should have defined an api version', inject(function (apiVersion) {
    expect(apiVersion).toBeDefined();
  }));
});
