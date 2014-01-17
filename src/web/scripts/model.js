/*global Class, angular */

(function (app) {
  'use strict';

  var Model = Class.extend({
    init: function (item) {
      angular.extend(this, item);
    }
  });

  app.factory('Company', function () {
    var constructor = Model.extend({});

    return constructor;
  });

  app.factory('Ingredient', function () {
    var constructor = Model.extend({
      init: function (item) {
        if (constructor.$types.indexOf(item.type) === -1) {
          throw new Error('Unsupported ingredient type: ' + item.type + '. Must be on of the following: [' + constructor.$types + ']');
        }

        this.parent(item);
      }
    });

    constructor.$types = ['grain', 'hop', 'yeast', 'misc'];

    return constructor;
  });

})(this.Justbrew);
