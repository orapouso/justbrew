/*global describe, it, expect, module, angular, document, waits, runs */

describe('Justbrew Models:', function () {
	'use strict';

	beforeEach(module('justbrew'));

  describe('Company Model', function () {
    var baseItem = {
      name: 'name'
    };

    var item;
    it('should initialize correctly with required values', inject(function (Company) {
      item = new Company(baseItem);
      expect(item.name).toBe('name');
    }));
  });

  describe('Ingredient Model', function () {
    var baseItem = {
      name: 'name',
      type: 'grain'
    };

    var item;
    it('should initialize correctly with required values', inject(function (Ingredient) {
      item = new Ingredient(baseItem);
      expect(item.name).toBe('name');
      expect(item.type).toBe('grain');
    }));
  });
});
