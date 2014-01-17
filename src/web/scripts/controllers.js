(function (app) {
  'use strict';

  app.controller('MainCtrl', ['$scope',
    function ($scope) {
    }
  ]);

  app.controller('HomeCtrl', ['$scope', '$resource',
    function ($scope, $resource) {
    }
  ]);

  app.controller('CompaniesCtrl', ['$scope', 'CompaniesRes', 'Company',
    function ($scope, CompaniesRes, Company) {
      CompaniesRes.get(function (data) {
        console.log('companies response', data);
      });
    }
  ]);

  app.controller('CompanyCtrl', ['$scope', '$routeParams', 'CompanyRes', 'Company',
    function ($scope, $routeParams, CompanyRes, Company) {
      if ($routeParams.id) {
        CompanyRes.get({id: $routeParams.id}, function (data) {
          console.log('company response', data);
        });
      }
    }
  ]);

  app.controller('IngredientsCtrl', ['$scope', 'IngredientsRes', 'Ingredient',
    function ($scope, IngredientsRes, Ingredient) {
      IngredientsRes.get(function (data) {
        console.log('ingredients response', data);
      });
    }
  ]);

  app.controller('IngredientCtrl', ['$scope', '$routeParams', 'IngredientRes', 'Ingredient',
    function ($scope, $routeParams, IngredientRes, Ingredient) {
      $scope.types = Ingredient.$types;
      if ($routeParams.id) {
        IngredientRes.get({id: $routeParams.id}, function (data) {
          console.log('response', data);
        });
      }
    }
  ]);
})(this.Justbrew);
