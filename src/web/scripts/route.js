(function (app) {
  'use strict';

  app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

      $locationProvider.html5Mode(true);

      $routeProvider
        .when('/companies', {
          templateUrl: '/templates/views/company/index.html',
          controller: 'CompaniesCtrl'
        })
        .when('/company/new', {
          templateUrl: '/templates/views/company/form.html',
          controller: 'CompanyCtrl'
        })
        .when('/company/:id', {
          templateUrl: '/templates/views/company/show.html',
          controller: 'CompanyCtrl'
        })
        .when('/company/:id/edit', {
          templateUrl: '/templates/views/company/form.html',
          controller: 'CompanyCtrl'
        })
        .when('/ingredients', {
          templateUrl: '/templates/views/ingredient/index.html',
          controller: 'IngredientsCtrl'
        })
        .when('/ingredient/new', {
          templateUrl: '/templates/views/ingredient/form.html',
          controller: 'IngredientCtrl'
        })
        .when('/ingredient/:id', {
          templateUrl: '/templates/views/ingredient/show.html',
          controller: 'IngredientCtrl'
        })
        .when('/ingredient/:id/edit', {
          templateUrl: '/templates/views/ingredient/form.html',
          controller: 'IngredientCtrl'
        })
        .when('/', {
          templateUrl: '/templates/views/home/index.html',
          controller: 'HomeCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  ]);
})(this.Justbrew);