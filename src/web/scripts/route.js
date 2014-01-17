(function (app) {
	'use strict';

	app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

		$locationProvider.html5Mode(true);

		$routeProvider
      .when('/ingredients', {templateUrl: '/templates/views/ingredients/index.html', controller: 'IngredientsCtrl'})
      .when('/ingredient/new', {templateUrl: '/templates/views/ingredients/form.html', controller: 'IngredientsCtrl'})
      .when('/ingredient/:id', {templateUrl: '/templates/views/ingredients/show.html', controller: 'IngredientCtrl'})
      .when('/ingredient/:id/edit', {templateUrl: '/templates/views/ingredients/form.html', controller: 'IngredientCtrl'})
			.when('/', {templateUrl: '/templates/views/home/index.html', controller: 'HomeCtrl'})
			.otherwise({redirectTo: '/'});
	}]);

})(this.Justbrew);
