window.mlaApp.controller(
				"dashboardCtrl",
				[
						'$scope',
						'$rootScope',
						'$modal',
						'$state',
						'$localStorage',
						'$http',
						'APIServices',
						'$log',
						'MLA_CONSTANT_MESSAGES',
						'cfpLoadingBar',
						'$filter',
						'MLA_CONSTANT',
						function($scope, $rootScope, $modal, $state, $localStorage, $http, APIServices, $log, MLA_CONSTANT_MESSAGES,cfpLoadingBar,$filter, MLA_CONSTANT) {
							
							if($localStorage.mlaAdminDetails != undefined)
							{
								$state.go("login");
								return
							}
							window.scrollTo(0, 0);
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
							$rootScope.isActive = "dashboard";
							$scope.dashboradCount = $scope.dashboradCount == undefined || $scope.dashboradCount == ""? ($scope.dashboardBeaconCount = 60.16,$scope.dashboardGatewayCount = 0.0007124) : true;
							
							
						$rootScope.loggingMessages = function(message,data,status){
							$log.log(message);
							$log.log(data);
							$log.log(status);
						}
						
						
						/***************************************************
						 * API Services for getDashBoardData
						 * 
						 * @version 1.0
						 * @Author_Vikas
						 * @created_date-
						 * @updated_date-
						 **************************************************/
						$rootScope.getDashBoardData = function() {
						    cfpLoadingBar.start();
							$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
							if($localStorage.MlaAdminDetails!=undefined)
							$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken;
							/*$scope.data1={"Image": ["D:/ml-backend/images/Machine-Leaning-Workflow-v-3.png"], "Blog": [{"header": "The future of Machine Learning in Finance", "image": "D:/ml-backend/images/business-chart-1.jpg", "link": "http://mindbowser.com/machine-learning-future-in-finance/"}, {"header": "Machine learning - A giant Leap in Supply chain and Logistics", "image": "D:/ml-backend/images/boats-cargo-container.jpg", "link": "http://mindbowser.com/supply-chain-and-logistics/"}, {"header": "Challenges faced in agriculture and how machine learning can be applied", "image": "D:/ml-backend/images/pexels-photo-616020.jpeg", "link": "http://mindbowser.com/solve-agricultural-problems-using-machine-learning/"}, {"header": "Wonders Machine Learning can do for Industries", "image": "D:/ml-backend/images/ML-1.png", "link": "http://mindbowser.com/wonders-machine-learning-can-do-for-industries/"}], "News": [{"link": "http://news.mit.edu/2018/revolutionizing-everyday-products-with-artificial-intelligence-mit-meche-0601", "news": "Revolutionizing everyday products with artificial intelligence"}, {"link": "http://news.mit.edu/2018/applying-machine-learning-to-challenges-in-pharmaceutical-industry-0517", "news": "Applying machine learning to challenges in the pharmaceutical industry"}, {"link": "http://news.mit.edu/2018/ml-20-machine-learning-many-data-science-0306", "news": "Machine learning for many"}]}
							$rootScope.dashBoardData = $scope.data1;
							cfpLoadingBar.complete();
							return;*/
							APIServices.getDashBoardData()
									.success(
											function(data, status) {
												if(data){
													$rootScope.dashBoardData = data;
   										 	 	}else{
													$rootScope.dashBoardData = [];
												}
												
												cfpLoadingBar.complete();
											})
									.error(
											function(data, status) {
												cfpLoadingBar.complete();
												if (data == null
														|| data == '') {
													MLA_CONSTANT.TOASTR.remove();
													MLA_CONSTANT.TOASTR
															.error(MLA_CONSTANT_MESSAGES.INTERNET_CONNECTION);
												} else {
                                                    if(status==401)
                                                    	{
                                                    		MLA_CONSTANT.TOASTR.remove();
                                                    		MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.ANOTHER_USER_LOGED_IN)
	                                                        $state.go('login')
	                                                        $localStorage.MlaAdminDetails=undefined
	                                                        	return
                                                    	}
													MLA_CONSTANT.TOASTR.remove();
													MLA_CONSTANT.TOASTR.error(data.error.message);
													$rootScope.loggingMessages("*Response Get Recommendation data cleaning list Failed, beaconCtrl*",data,status);
												}
											});
						}
							
} ]);

window.mlaApp.controller('dashboardPopupController', function($scope, $rootScope,
		$modalStack, $modalInstance) {

	$rootScope.cancel = function() {

		if ($modalInstance) {
			$modalInstance.dismiss('cancel');
		}

	};
	
});