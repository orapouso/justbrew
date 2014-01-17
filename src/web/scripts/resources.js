(function (app) {
  'use strict';

  app.factory('CompaniesRes', ['$resource', function ($resource) {
    return $resource('/api/companies');
  }]);

  app.factory('CompanyRes', ['$resource', function ($resource) {
    return $resource('/api/company/:id');
  }]);

  app.factory('IngredientsRes', ['$resource', function ($resource) {
    return $resource('/api/ingredients');
  }]);

  app.factory('IngredientRes', ['$resource', function ($resource) {
    return $resource('/api/ingredient/:id');
  }]);

})(this.Justbrew);
