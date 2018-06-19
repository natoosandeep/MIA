window.mlaApp.controller(
				"loginCtrl",
				[
						'$scope',
						'$rootScope',
						'APIServices',
						'MLA_CONSTANT_MESSAGES',
						'$localStorage',
						'$http',
						'cfpLoadingBar',
						'md5',
						'$state',
						'MLA_CONSTANT',
						function($scope, $rootScope, APIServices, MLA_CONSTANT_MESSAGES, $localStorage, $http, cfpLoadingBar, md5, $state, MLA_CONSTANT) {
						
						/*if($localStorage.mlaAdminDetails != undefined)
						{
							$state.go("dashboard");
							return
						}*/
						$scope.isLoginButtonClicked = false;
						$scope.isForgotPasswordButtonClicked=false;
						$scope.setCheckValue = function() {

							if ($scope.isChecked)
								$scope.isChecked = false;
							else
								$scope.isChecked = true;
						};
						
						if ($localStorage.mlpAdminUsername != undefined) {
							$scope.adminEmail = $localStorage.mlpAdminUsername;
							$scope.adminPassword = $localStorage.mplAdminPassword;
							$scope.isChecked = true;
						}
						
						$scope.login = function(){
							if ($scope.isChecked) {
								$localStorage.mlpAdminUsername = $scope.mlpAdminUsername;
								$localStorage.mplAdminPassword = $scope.mplAdminPassword;
							} else {
								$localStorage.mlpAdminUsername = undefined;
								$localStorage.mplAdminPassword = undefined;
								
							}
							
							if($scope.mlpAdminUsername == undefined || $scope.mlpAdminUsername.trim() == ""){
								MLA_CONSTANT.TOASTR.remove();
								MLA_CONSTANT.TOASTR.error("Please enter a valid Username.","", 
										{
											"timeOut" : "1000",
											"extendedTImeout" : "1000"
										});
								return;
							}
							/*if(!validateMlaEmail($scope.mlpAdminUsername)){
								MLA_CONSTANT.TOASTR.remove();
								MLA_CONSTANT.TOASTR.error("Please enter a valid Email ID.","", 
										{
											"timeOut" : "1000",
											"extendedTImeout" : "1000"
										});
								return;
							}*/
							if($scope.mplAdminPassword == undefined || $scope.mplAdminPassword.trim() == ""){
								MLA_CONSTANT.TOASTR.remove();
								MLA_CONSTANT.TOASTR.error("Please enter a valid Password.","", 
										{
											"timeOut" : "1000",
											"extendedTImeout" : "1000"
										});
								return;
							}
							
							cfpLoadingBar.start();
							$scope.isLoginButtonClicked = true;
							$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
							$http.defaults.headers.common['Authorization'] = 'Basic Ymx1ZGVudGU6Ymx1ZGVudGUxMjM=';
							
							APIServices.validateLogin($scope.mlpAdminUsername,
												$scope.mplAdminPassword)
												.success(function(data){
													cfpLoadingBar.complete();
													if(data.status=="SUCCESS"){
														$localStorage.MlaAdminDetails = true;
														$rootScope.tab=data.tabs;
													   if($rootScope.tab.includes('phosphorusRegression') && $rootScope.tab.includes('sensorAnomaly') && $rootScope.tab.includes('survey') ){
														   $localStorage.selectPAR=true;
														   
														}else if($rootScope.tab.includes('phosphorusRegression') && $rootScope.tab.includes('sensorAnomaly') ){
															$localStorage.selectPA=true;
															$localStorage.selectAP=true;
														}
														else if($rootScope.tab.includes('phosphorusRegression') && $rootScope.tab.includes('survey') ){
															$localStorage.selectPR=true;
															$localStorage.selectRP=true;
														}
														else if($rootScope.tab.includes('sensorAnomaly') && $rootScope.tab.includes('survey') ){
															$localStorage.selectAR=true;
															$localStorage.selectRA=true;
														}
														else if($rootScope.tab.includes('phosphorusRegression')){
															$localStorage.selectP=true;
														}
														else if($rootScope.tab.includes('sensorAnomaly')){
															$localStorage.selectA=true;
														}
														else if($rootScope.tab.includes('survey')){
															$localStorage.selectR=true;
														}
													   $rootScope.selectPAR=$localStorage.selectPAR;
													   $rootScope.selectPA=$localStorage.selectPA;
													   $rootScope.selectAP=$localStorage.selectAP;
													   $rootScope.selectPR=$localStorage.selectPR;
													   $rootScope.selectRP=$localStorage.selectRP;
													   $rootScope.selectAR=$localStorage.selectAR;
													   $rootScope.selectRA=$localStorage.selectRA;
													   $rootScope.selectP=$localStorage.selectP;
													   $rootScope.selectA=$localStorage.selectA;
													   $rootScope.selectR=$localStorage.selectR;
													}
													else{
														$localStorage.MlaAdminDetails = undefined;
														MLA_CONSTANT.TOASTR.remove();
														MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.INVALID_CREDENTIALS);
													}
													$state.go('dashboard');
													$scope.isLoginButtonClicked = false;
												})
												.error(
														function(data) {
															cfpLoadingBar.complete();
															$scope.isLoginButtonClicked = false;
															if (data == null
																	|| data == '') {
																/****
																 * 
																 console.log(data)
																console.log(status);
																*/
																MLA_CONSTANT.TOASTR.remove();
																MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.INTERNET_CONNECTION);
															} else {
																MLA_CONSTANT.TOASTR.remove();
																MLA_CONSTANT.TOASTR.error(data.error.message);
															}
														});
						}//End of login
						
						/***************************************************
							 * This code require for forgot passwords
							 * delete_confirmation
							 * 
							 * @version 1.0
							 * @Author-Bharat
							 * @created_date-
							 * @updated_date-
							 **************************************************/

							$scope.forgotPassword = function() {
								if($scope.adminForgotEmail==undefined || $scope.adminForgotEmail.trim()=="")
									{
									MLA_CONSTANT.TOASTR.remove()
									MLA_CONSTANT.TOASTR.error("Please enter a valid Email ID.");
									return
									}
								if(!validateMlaEmail($scope.adminForgotEmail)){
									MLA_CONSTANT.TOASTR.remove()
									MLA_CONSTANT.TOASTR.error("Please enter a valid Email ID.");
									return
								}
								cfpLoadingBar.start();
								$scope.isForgotPasswordButtonClicked=true;
								APIServices.forgotPassword($scope.adminForgotEmail)
										.success(
												function(data) {
													cfpLoadingBar.complete();
													MLA_CONSTANT.TOASTR.success(data.message);
													$rootScope.resetPasswordMessage = data.message;
													$scope.isForgotPasswordButtonClicked=false;
										})
										.error(
												function(data) {
													cfpLoadingBar.complete();
													$scope.isForgotPasswordButtonClicked=false;
													if (data == null) {
														MLA_CONSTANT.TOASTR.remove();
														MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.INTERNET_CONNECTION);
														$rootScope.resetPasswordMessage = 'Internet connection problem.';
													} else {

														MLA_CONSTANT.TOASTR.remove();
														MLA_CONSTANT.TOASTR.error(data.error.message);
														$rootScope.resetPasswordMessage = data.error.message;
													}
												});

							}
							function validateMlaEmail(email) {
					          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					          return re.test(email);
					        }
						} ]);

window.mlaApp.controller('loginPopupController', function($scope, $rootScope,
		$modalStack, $modalInstance) {

	$rootScope.cancel = function() {

		if ($modalInstance) {
			$modalInstance.dismiss('cancel');
		}

	};

});
