(function (app) {
  'use strict';

  app.controller('MainCtrl', ['$scope', '$location', '$cookies',
    function ($scope, $location, $cookies) {
      var auth = $cookies.Authorization || $location.search().Authorization;
      $cookies.Authorization = auth;
    }
  ]);

  app.controller('HomeCtrl', ['$scope', '$resource',
    function ($scope, $resource) {
    }
  ]);

  app.controller('CompaniesCtrl', ['$scope', 'CompaniesRes', 'Company',
    function ($scope, CompaniesRes, Company) {
      $scope.companies = [];
      CompaniesRes.query(function (data) {
        data.forEach(function (c) {
          $scope.companies.push(new Company(c));
        });
      });
    }
  ]);

  app.controller('CompanyCtrl', ['$scope', '$routeParams', 'CompanyRes', 'Company',
    function ($scope, $routeParams, CompanyRes, Company) {
      $scope.company = new Company();

      $scope.send = function () {
        if ($scope.company.$save) {
          $scope.company.$save();
        } else {
          CompanyRes.save($scope.company, function (company) {
            $scope.company = company;
          });
        }
      };

      if ($routeParams.id) {
        CompanyRes.get({id: $routeParams.id}, function (company) {
          $scope.company = company;
        });
      }
    }
  ]);

  app.controller('IngredientsCtrl', ['$scope', 'IngredientsRes', 'Ingredient',
    function ($scope, IngredientsRes, Ingredient) {
      IngredientsRes.get(function (data) {

      });
    }
  ]);

  app.controller('IngredientCtrl', ['$scope', '$routeParams', 'IngredientRes', 'Ingredient',
    function ($scope, $routeParams, IngredientRes, Ingredient) {
      $scope.types = Ingredient.$types;
      if ($routeParams.id) {
        IngredientRes.get({id: $routeParams.id}, function (data) {

        });
      }
    }
  ]);
})(this.Justbrew);
