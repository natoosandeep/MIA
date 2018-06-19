window.mlaApp.controller(
				"mainCtrl",
				[
						'$scope',
						'$rootScope',
						'$modal',
						'$log',
						'$state',
						'cfpLoadingBar',
						'APIServices',
						'$localStorage',
						'MLA_CONSTANT_MESSAGES',
						'$http',
						'MLA_CONSTANT',
						function($scope, $rootScope, $modal, $log, $state, cfpLoadingBar, APIServices,$localStorage, MLA_CONSTANT_MESSAGES, $http, MLA_CONSTANT) {
							
							if($localStorage.MlaAdminDetails == undefined)
							{
								$state.go("login");
								return
							}	
							$scope.isLogoutButtonClicked = false;
							$scope.isChangePasswordButtonClicked = false;
							$rootScope.isActiveMenu = function(menu) {
								$rootScope.isActive = menu
							};
							/****************************
							 * @Author : bharat
							 * @Version : 1.0
							 * READ JSON FROM AWS URL,
							 */
							if($localStorage.MlaAdminDetails != undefined && $localStorage.clientData != undefined){
								$scope.dashboardCardData = $localStorage.clientData.dashboardCardData;
								$scope.clientData=$localStorage.clientData;
								$scope.clientCategoryData = $localStorage.clientData.adminDetails.name;
							}else{
								$scope.dashboardCardData = [{
							 		"title": "Beacons",
							 		"count": 0,
							 		"icon": "icon-layers"
							 	}, {
							 		"title": "Gateways",
							 		"count": 0,
							 		"icon": "icon-paypal"
							 	}, {
							 		"title": "Venues",
							 		"count": 0,
							 		"icon": "icon-chart"
							 	}];
							}
							/************************************
							 * If logout confirm, then set authToken undefined and forward to login page
							 * 
							 *  @Version : 1.0
							 *  @Author : bharat
							 *  @dateCreated : 
							 *************/
								$rootScope.logout = function() {
								$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken;
								cfpLoadingBar.start();
								$scope.isLogoutButtonClicked = true;
								APIServices.logout()
										.success(
												function(data, status) {
													$rootScope.loggingMessages("*Response logout, mainCtrl*",data,status);
													$localStorage.MlaAdminDetails = undefined;
													$rootScope.cancel();
													$state.go("login");
													$rootScope.selectPAR=$localStorage.selectPAR = undefined;
													   $rootScope.selectPA=$localStorage.selectPA = undefined;
													   $rootScope.selectAP=$localStorage.selectAP = undefined;
													   $rootScope.selectPR=$localStorage.selectPR = undefined;
													   $rootScope.selectRP=$localStorage.selectRP = undefined;
													   $rootScope.selectAR=$localStorage.selectAR = undefined;
													   $rootScope.selectRA=$localStorage.selectRA = undefined;
													   $rootScope.selectP=$localStorage.selectP = undefined;
													   $rootScope.selectA=$localStorage.selectA = undefined;
													   $rootScope.selectR=$localStorage.selectR = undefined;
													
													cfpLoadingBar.complete();
													$scope.isLogoutButtonClicked = false;
												})
										.error(
												function(data, status) {
													cfpLoadingBar.complete();
													$scope.isLogoutButtonClicked = false;
													if (data == null
															|| data == '') {
														MLA_CONSTANT.TOASTR.remove();
														MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.INTERNET_CONNECTION);
														$rootScope.loggingMessages("*Response logout Failed, mainCtrl*",data,status);
													}
													 if(status==401)
                                                  	{
                                                  	MLA_CONSTANT.TOASTR.remove();
                      								MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.ANOTHER_USER_LOGED_IN)
														 $rootScope.cancel();
														 $state.go('login');
														 $localStorage.MlaAdminDetails=undefined;
														 return
                                                  	}
													 else
														 {
														 MLA_CONSTANT.TOASTR.remove();
		                      							 MLA_CONSTANT.TOASTR.error(data);
														 }
												});
							}

							/***************************************************
							 * This code require for opening modal box for
							 * Change Password
							 * 
							 * @version 1.0
							 * @Author-Bharat
							 * @created_date-
							 * @updated_date-
							 **************************************************/
							$rootScope.openChangePasswordPopUp = function() {
								var size='md'
								var modalInstance = $modal
										.open({
											templateUrl : 'template/popup/changePassword.html',
											controller : 'mainPopupController',
											size : size,
											scope : $scope,
											backdrop : 'static',
											resolve : {
												items : function() {
													return $scope.items;
												}
											}
										});

								modalInstance.result.then(
										function(selectedItem) {
											$scope.selected = selectedItem;
										}, function() {
											$log.info('Modal dismissed at: '
													+ new Date());
										});
							};
							
							/***************************************************
							 * This code require for opening modal box for
							 * Logout
							 * 
							 * @version 1.0
							 * @Author-Bharat
							 * @created_date-
							 * @updated_date-
							 **************************************************/
							$rootScope.openLogOut = function() {
								var size='md'
								var modalInstance = $modal
										.open({
											templateUrl : 'template/popup/logout.html',
											controller : 'mainPopupController',
											size : size,
											scope : $scope,
											backdrop : 'static',
											resolve : {
												items : function() {
													return $scope.items;
												}
											}
										});

								modalInstance.result.then(
										function(selectedItem) {
											$scope.selected = selectedItem;
										}, function() {
											$log.info('Modal dismissed at: '
													+ new Date());
										});
							};
							
							$rootScope.loggingMessages = function(message,data,status){
								$log.log(message);
								$log.log(data);
								$log.log(status);
							}
							
} ]);

window.mlaApp.controller('mainPopupController', function($scope, $rootScope,
		$modalStack, $modalInstance, MLA_CONSTANT_MESSAGES, $http, $localStorage, md5, cfpLoadingBar, APIServices, MLA_CONSTANT) {

	$rootScope.cancel = function() {

		if ($modalInstance) {
			$modalInstance.dismiss('cancel');
		}

	};
	
	$rootScope.save = function() {

		if ($modalInstance) {
			$modalInstance.dismiss('cancel');
		}

	};
	
	/*****
	 * @Author : bharat
	 * @Version : 1.0
	 * Change password*/
	$rootScope.ChangePassword = function(){
		if($scope.oldPassword==undefined||$scope.oldPassword=="")
		{
		 MLA_CONSTANT.TOASTR.remove();
		 MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.OLDPASSWORD_BLANK);
		return
		}
		else if($scope.newPassword==undefined||$scope.newPassword=="")
			{
			 MLA_CONSTANT.TOASTR.remove();
			 MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.PASSWORD_BLANK);
			return
			}
		else if($scope.confirmPassword==undefined||$scope.confirmPassword=="")
		{
		 MLA_CONSTANT.TOASTR.remove();
		 MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.CONFIRMPASSWORD_BLANK);
		return
		}
		else if($scope.newPassword.length<6 || $scope.newPassword>15 || $scope.confirmPassword.length<6 || $scope.confirmPassword>15)
			{
			 MLA_CONSTANT.TOASTR.remove();
			 MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.PASSWORD_ERROR_LENGTH);
			return
			}
		else if($scope.newPassword!=$scope.confirmPassword)
			{
			MLA_CONSTANT.TOASTR.remove();
			 MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.PASSWORD_CONFIRM_SAME_ERROR);
			return
			}
		
		else if($scope.oldPassword==$scope.newPassword)
			{
			MLA_CONSTANT.TOASTR.remove();
			 MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.OLD_AND_NEW_PASSWORD_SAME_ERROR_MESSAGE);
			return
			}
		$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken;
		cfpLoadingBar.start();
		$scope.isChangePasswordButtonClicked = true;
		APIServices
				.changePassword($localStorage.MlaAdminDetails.email,md5.createHash($scope.oldPassword),md5.createHash($scope.newPassword),md5.createHash($scope.confirmPassword)
						)
				.success(
						function(data, status) {
							$rootScope.loggingMessages("*Response change Password, mainCtrl*",data,status);
							MLA_CONSTANT.TOASTR.remove();
							MLA_CONSTANT.TOASTR.success(MLA_CONSTANT_MESSAGES.PASSWORD_CHANGE_SUCCESS);
							$rootScope.cancel();
							cfpLoadingBar.complete()
							$scope.isChangePasswordButtonClicked = false;
						})
				.error(
						function(data, status) {
							cfpLoadingBar.complete();
							$scope.isChangePasswordButtonClicked = false;
							if (data == null||data=='') {
								MLA_CONSTANT.TOASTR.remove();
								MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.INTERNET_CONNECTION);
								$rootScope.cancel();
							} else {
								$rootScope.loggingMessages("*Response change Password Failed, mainCtrl*",data,status);
								MLA_CONSTANT.TOASTR.remove();
								MLA_CONSTANT.TOASTR.error(data.error.message);
							}
						});

		
	}
	
});

