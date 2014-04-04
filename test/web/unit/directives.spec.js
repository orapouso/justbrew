/* global describe, it, expect, module, angular, document, waits, runs */

describe('Justbrew Directives:', function () {
  'use strict';

  var $s, element;

  beforeEach(module('justbrew'));

  //Inject templates
  //beforeEach(module('/static/templates/partials/search/item.html'));

  beforeEach(inject(function ($rootScope) {
    $s = $rootScope.$new();
  }));

  describe('Directive lazy-src', function () {
    var $c;
    var testImage = 'http://upload.wikimedia.org/wikipedia/en/c/cb/Flyingcircus_2.jpg';

    function createImg(attrs, scope) {
      attrs = attrs || {};
      var src = attrs.src || 'invalid-src';
      delete attrs.src;
      var attributes = '';

      for (var a in attrs) {
        if (attrs.hasOwnProperty(a)) {
          attributes += ' ' + a + '="' + attrs[a] + '"';
        }
      }

      element = angular.element('<img lazy-src="' + src + '"' + attributes + ' />');
      $s = scope || $s;
      $c(element)($s);
      $s.$digest();
    }


    beforeEach(inject(function ($compile) {
      $c = $compile;
    }));

    it('should have no initial src attribute', function () {
      createImg();
      expect(element[0].src).toBe('');
    });

    it('should add class defined in "lazy-class" attribute or default "lazy" if none is provided while item is loading', function () {
      createImg();
      expect(element).toHaveClass('lazy');

      createImg({'lazy-class': 'lazy-loading'});
      expect(element).toHaveClass('lazy-loading');
    });

    it('should load existing image to img src', function () {
      createImg({'src': testImage});
      waits(1000);
      runs(function () {
        expect(element[0].src).toBe(testImage);
      });
    });

    it('should add class defined in "lazy-error" attribute or default "lazy-error" if none is provide and if there is any error while loading img src', function () {
      createImg({'src': 'ivalid-src.jpg'});
      waits(500);
      runs(function () {
        expect(element).toHaveClass('lazy-error');

        createImg({'src': 'ivalid-src.jpg', 'lazy-error': 'lazy-error-loading'});
        waits(500);
        runs(function () {
          expect(element).toHaveClass('lazy-error-loading');
        });
      });
    });

    it('should resolve {{expressions}} for lazy-src', function () {
      $s.lazyExpression = 'expr';
      createImg({'src': 'ivalid-{{lazyExpression}}-src.jpg'}, $s);
      waits(500);
      runs(function () {
        expect(element.attr('lazy-src')).toBe('ivalid-expr-src.jpg');
      });
    });

  });

});
