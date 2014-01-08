/*global Justbrew, describe, it, expect, module, angular, document, waits, runs */

describe('Justbrew Models:', function () {
	'use strict';

	beforeEach(module('justbrew'));

	describe('Ingredient Model', function () {
		var baseItem = {};

		var item;
		it('should initialize correctly with required values', function () {
			item = new Justbrew.Ingredient(baseItem);
		});
	});
});
