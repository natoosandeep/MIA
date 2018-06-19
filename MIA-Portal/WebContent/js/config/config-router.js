window.mlaApp.config([ '$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.otherwise('/dashboard');
			
			$stateProvider
			.state('dashboard', {
				url : '/dashboard',
				templateUrl : 'template/dashboard.html',
				controller : 'dashboardCtrl'
			}).state('login', {
				url : '/login',
				templateUrl : 'template/login.html',
				controller : 'loginCtrl'
			}).state('forgot-page', {
				url : '/forgot-page',
				templateUrl : 'template/forgot-page.html',
				controller : 'loginCtrl'
			}).state('reset-password', {
				url : '/reset-password',
				templateUrl : 'template/reset-page.html',
				controller : 'resetPasswordCtrl'
			}).state('logout', {
				url : '/logout',
				templateUrl : 'template/popup/logout.html',
				controller : 'mainCtrl'
			}).state('phosphorus', {
				url : '/phosphorus',
				templateUrl : 'template/phosphorus.html',
				controller : 'phosphorusCtrl'
			}).state('anomaly', {
				url : '/anomaly',
				templateUrl : 'template/anomaly.html',
				controller : 'anomalyCtrl'
			}).state('recommendation', {
				url : '/recommendation',
				templateUrl : 'template/recommendation.html',
				controller : 'recommendationCtrl'
			}).state('table-3350-popup', {
				url : '/dashboard',
				templateUrl : 'template/dashboard.html',
				controller : 'dashboardCtrl'
			})
			$urlRouterProvider.otherwise('/login');
			
}]);