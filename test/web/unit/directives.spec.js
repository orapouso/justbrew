/*global describe, it, expect, module, angular, document, waits, runs */

describe('Justbrew Directives:', function () {
  'use strict';

  var $s, element;

  beforeEach(module('justbrew'));

  //Inject templates
  //beforeEach(module('/static/templates/partials/search/item.html'));

  beforeEach(inject(function ($rootScope) {
    $s = $rootScope.$new();
  }));

  describe('Filter timecode', function () {
    var $f, offsetms = new Date().getTimezoneOffset() * 60 * 1000;
    var dateFilter, timecodeFilter;
    beforeEach(inject(function ($filter) {
      $f = $filter;
      dateFilter = function (input, format) {
        if (angular.isNumber(input)) {
          input += offsetms;
        }
        return $f('date')(input, format);
      };
      timecodeFilter = $f('timecode');
    }));

    it('should return 00:00:00:00 for invalid input', function () {
      expect(timecodeFilter(null)).toBe('00:00:00:00');
      expect(timecodeFilter(undefined)).toBe('00:00:00:00');
      expect(timecodeFilter('')).toBe('00:00:00:00');
      expect(timecodeFilter('invalid')).toBe('00:00:00:00');
      expect(timecodeFilter(0)).toBe('00:00:00:00');
      expect(timecodeFilter(1000, 'HH:mm:ss.sss')).toBe('00:00:01.000');
      expect(timecodeFilter(1100, 'HH:mm:ss.sss')).toBe('00:00:01.100');
      expect(timecodeFilter(152123.456789, 'HH:mm:ss.sss')).toBe('00:02:32.123');
      expect(timecodeFilter(152001.23, 'HH:mm:ss.sss')).toBe('00:02:32.001');
      expect(timecodeFilter(152201.23, 'HH:mm:ss.sss')).toBe('00:02:32.201');
      expect(timecodeFilter(3752201.23, 'HH:mm:ss.sss')).toBe('01:02:32.201');
    });

    it('should act like a normal date filter for formats without "frame"', function () {
      var d = 1;
      var dateString = dateFilter(d, 'medium');
      var timecodeString = timecodeFilter(d, 'medium');
      expect(dateString).toBe(timecodeString);

      d = new Date();
      dateString = dateFilter(d, 'medium');
      timecodeString = timecodeFilter(d, 'medium');
      expect(dateString).toBe(timecodeString);
    });

    it('should convert without drop frame', function () {
      var frames = 1799;
      var format = 'HH:mm:ss:ff';

      var timecodeString = timecodeFilter(frames, format, false);
      expect(timecodeString).toBe('00:00:59:29');

      frames = 1800;
      timecodeString = timecodeFilter(frames, format, false);
      expect(timecodeString).toBe('00:01:00:00');
    });

    it('should convert with drop frame', function () {
      var frames = 1799;
      var format = 'HH:mm:ss:ff';

      var timecodeString = timecodeFilter(frames, format);
      expect(timecodeString).toBe('00:00:59:29');

      frames = 1800;
      timecodeString = timecodeFilter(frames, format);
      expect(timecodeString).toBe('00:01:00:02');

      frames += 1;
      timecodeString = timecodeFilter(frames, format);
      expect(timecodeString).toBe('00:01:00:03');
      frames -= 1;

      frames = (frames * 2) - 2;
      timecodeString = timecodeFilter(frames, format);
      expect(timecodeString).toBe('00:02:00:02');

      frames = (frames * 5) - 8;
      timecodeString = timecodeFilter(frames, format);
      expect(timecodeString).toBe('00:10:00:00');

      frames += 1;
      timecodeString = timecodeFilter(frames, format);
      expect(timecodeString).toBe('00:10:00:01');
    });
  });

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
