window.mlaApp.controller("resetPasswordCtrl", [
		'$scope',
		'$rootScope',
		'MLA_CONSTANT_MESSAGES',
		'md5',
		'cfpLoadingBar',
		'APIServices',
		'$http',
		'$location',
		'MLA_CONSTANT',
		'$state',
		'$localStorage',
		'$modal',
		'$log',
		'$dialogs',
		function($scope, $rootScope, MLA_CONSTANT_MESSAGES, md5, cfpLoadingBar, APIServices, $http, $location, MLA_CONSTANT, $state, $localStorage, $model, $log, $dialogs) {
			
			$scope.isResetPasswordButtonClicked = false;
			$rootScope.resetPassword=function(){
				var url = window.location.href;
				if(url.indexOf('?')==-1)
					{
					 MLA_CONSTANT.TOASTR.remove();
					 MLA_CONSTANT.TOASTR.error("Invalid URL contact to admin.");
					return
					}
				var hash = url.substring(url.indexOf('?') + 1);
				if($scope.password==undefined||$scope.password=='')
					{
					 MLA_CONSTANT.TOASTR.remove();
					 MLA_CONSTANT.TOASTR.error("Please enter a valid Password.");
					return
					}	

				if($scope.confirmPassword==undefined||$scope.confirmPassword=='')
				{
				MLA_CONSTANT.TOASTR.remove();
				 MLA_CONSTANT.TOASTR.error("Please enter a valid Password.");
				return
				}
			
				if($scope.password.length < 6 || $scope.password > 15)
				{	
				 MLA_CONSTANT.TOASTR.remove();
				 MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.PASSWORD_ERROR_LENGTH);
				return
				}
			
			if($scope.confirmPassword.length<6 || $scope.confirmPassword>15)
			{
			 MLA_CONSTANT.TOASTR.remove();
			 MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.PASSWORD_ERROR_LENGTH);
			return
			}
			if($scope.password!=$scope.confirmPassword)
				{
				MLA_CONSTANT.TOASTR.remove();
				 MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.PASSWORD_CONFIRM_SAME_ERROR);
				return
				}
			cfpLoadingBar.start();
			$scope.isResetPasswordButtonClicked = true;
			$http.defaults.headers.common['authToken'] = hash;
			APIServices
			.resetPassword(md5.createHash($scope.password),md5.createHash($scope.confirmPassword),hash
					)
			.success(
					function(data, status) {
						$rootScope.loggingMessages("*Response Reset Password, resetPasswordCtrl*",data,status);
						$scope.resetPasswordMessage = data.message;
						MLA_CONSTANT.TOASTR.remove();
						MLA_CONSTANT.TOASTR.success(data.message);
						$state.go('login');
						cfpLoadingBar.complete();
						$scope.isResetPasswordButtonClicked = false;
					})
			.error(
					function(data, status) {
						cfpLoadingBar.complete();
						$scope.isResetPasswordButtonClicked = false;
						if (data == null||data=='') {
							MLA_CONSTANT.TOASTR.remove();
							MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.INTERNET_CONNECTION);
						} else {

							if(data.error.message!=MLA_CONSTANT_MESSAGES.INVALID_AUTH_TOKEN)
							{
								MLA_CONSTANT.TOASTR.remove();
								MLA_CONSTANT.TOASTR.error(data.error.message);
							}
							else
							{
								MLA_CONSTANT.TOASTR.remove();
								MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.USER_NOT_AUTHENTICATED);
							}
						}
						$rootScope.loggingMessages("*Response Reset Password Failed, resetPasswordCtrl*",data,status);
					});
			}
			
		} ]);

