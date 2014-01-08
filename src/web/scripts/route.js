(function (app) {
	'use strict';

	app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

		$locationProvider.html5Mode(true);

		$routeProvider
			.when('/ingredients', {templateUrl: '/static/templates/views/ingredients/index.html', controller: 'IngredientsCtrl'})
			.when('/', {templateUrl: '/static/templates/views/home/index.html', controller: 'HomeCtrl'})
			.otherwise({redirectTo: '/'});
	}]);

})(this.Justbrew);
