window.mlaApp.run(['$http','$localStorage'
               ,function($http, $localStorage){
	
			
			if ($localStorage.MlaAdminDetails != undefined)
				$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken;
		
			$http.defaults.headers.common['Content-Type'] = "application/json";
			$http.defaults.headers.common.language = 'en-US';
			$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
}])

.config(
		[
				'$httpProvider',
				function($httpProvider) {

					$httpProvider.defaults.headers.common['Authorization'] = "Basic bG9jYWxtb3RpdmVzOmxvY2FsbW90aXZlcw==";
				} ]); // close module