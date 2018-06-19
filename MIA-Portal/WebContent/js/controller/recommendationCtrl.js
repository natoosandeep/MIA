window.mlaApp.controller(
				"recommendationCtrl",
				[
						'$scope',
						'$rootScope',
						'$modal',
						'$log',
						'$state',
						'APIServices',
						'cfpLoadingBar',
						'$http',
						'$localStorage',
						'MLA_CONSTANT_MESSAGES',
						'MLA_CONSTANT',
						'$timeout',
						function($scope, $rootScope, $modal, $log, $state, APIServices, cfpLoadingBar, $http, $localStorage, MLA_CONSTANT_MESSAGES, MLA_CONSTANT, $timeout) {
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
							$rootScope.isActive = "recommendation";
							$scope.recommendationCurrentStep = 'uploadCSV';
							
							$scope.editBeaconTypePerPage = 20;
							if($localStorage.MlaAdminDetails == undefined)
							{
								$state.go("login");
								return
							}
							
							$scope.surveyGridList = 
								[
			                           {
			                        	   title: 'Average age',
			                        	   value: 32
			                           },{
			                        	   title: 'Average no of child',
			                        	   value: 20
			                           },
			                           {
			                        	   title: 'Female %',
			                        	   value: 85
			                           },
			                           {
			                        	   title: 'Male %',
			                        	   value: 15
			                           }
							];
							
							$(".disableRecommAnchor").attr("disabled",true);
							$(".disableRecommAnchor").css("pointer-events","initial");
							$scope.currentRecommendationStep = function(navType){
								if($('#uploadCSV').hasClass("current")){
									$(".disablePhosphorusAnchorSkip").attr("disabled",false);
									$(".disablePhosphorusAnchorSkip").css("display","initial");
									$(".disableRecommAnchor").attr("disabled",true);
									$(".disableRecommAnchor").css("pointer-events","none");
									$scope.recommendationCurrentStep = 'uploadCSV';
								}
								else if($('#dataCleaning').hasClass("current")){
									if(navType == 'prev'){
										$scope.phosphorusCurrentStep = 'recommendationResult';
										$(".disableRecommAnchor").attr("disabled",true);
										$(".disableRecommAnchor").css("pointer-events","none");
										MLA_CONSTANT.TOASTR.remove();
										MLA_CONSTANT.TOASTR.error("Model already created");
										return;
									}
									$(".disablePhosphorusAnchorSkip").attr("disabled",true);
									$(".disablePhosphorusAnchorSkip").css("display","none");
									$(".disableRecommAnchor").attr("disabled",true);
									$(".disableRecommAnchor").css("pointer-events","none");
									$rootScope.getRecommendationDataCleaningList();
									$scope.recommendationCurrentStep = 'dataCleaning';
								}
								else if($('#applyingModel').hasClass("current")){
									$scope.recommendationCurrentStep = 'applyingModel';
									if(navType == 'next')
									$rootScope.getSurveyDetailsList();
									else{
										$scope.recommendationCurrentStep = 'recommendationResult';
										$(".disablePhosphorusAnchor").attr("disabled",true);
										$(".disablePhosphorusAnchor").css("pointer-events","none");
										MLA_CONSTANT.TOASTR.remove();
										MLA_CONSTANT.TOASTR.error("Model already created");
										return;
										
									}
								}// else if close
								else if($('#recommendationResult').hasClass("current")){
									$scope.recommendationCurrentStep = 'recommendationResult';
								}
							}
							
							
							 $scope.gotoDashboard = function(){
								  
								  $state.go('dashboard');
								  $('#nxt').removeClass('hide');
								  
							  }
							
							$rootScope.getRecommendationDataCleaningList = function() {
								
								$(".disableAnomalyAnchor").attr("disabled","disabled");
								$(".disableAnomalyAnchor").css("pointer-events","none");
								cfpLoadingBar.start();
								$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
								if($localStorage.MlaAdminDetails!=undefined)
								$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken;
								APIServices.getRecommendationDataCleaning()
										.success(
												function(data, status) {
													if(data){
														data.TABLE_TITLES.splice(0,1);
														$rootScope.recommendationDataCleaningList = data;
														$(".disableRecommAnchor").attr("disabled",false);
														$(".disableRecommAnchor").css("pointer-events","initial");
													
													}else{
														$rootScope.recommendationDataCleaningList = [];
													}
													$scope.recommendationRegressionIsEmpty = undefined;
													
													$(".disableRecommAnchor").attr("disabled",false);
													$(".disableRecommAnchor").css("pointer-events","initial");
													cfpLoadingBar.complete();
												})
										.error(
												function(data, status) {
													$(".disableRecommAnchor").attr("disabled",false);
													$(".disableRecommAnchor").css("pointer-events","initial");
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
							}// end getRecommendationDataCleaning()
							
							/*$rootScope.chart1=true;
							$rootScope.nextPieChart = function(no) {
								if(no=='1'){
									$rootScope.chart1=true;
									$rootScope.chart2=false;
									$rootScope.chart3=false;
								} else if(no=='2'){
									$rootScope.chart1=false;
									$rootScope.chart2=true;
									$rootScope.chart3=false;
								}else if(no=='3'){
									$rootScope.chart1=false;
									$rootScope.chart2=false;
									$rootScope.chart3=true;
								}
								
							}*/
							
							
							  /**
								 * Pie Chart details : data cleaning
								 */
							/*$scope.dataCleaningOptions = {
									legend: {display: true,position: 'top'}
							};
							*/
							/***************************************************
							 * API Services for getSurveyDetailsList
							 * 
							 * @version 1.0
							 * @Author-Bharat
							 * @created_date-
							 * @updated_date-
							 **************************************************/
							$rootScope.getSurveyDetailsList = function() {
								$(".disableRecommAnchor").attr("disabled","disabled");
								$(".disableRecommAnchor").css("pointer-events","none");
								cfpLoadingBar.start();
								$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
								if($localStorage.MlaAdminDetails!=undefined)
								$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken
								APIServices.getSurveyDetails()
										.success(
												function(data, status) {
													$('#nxt').addClass('hide');
													$rootScope.loggingMessages("*Response Get Survey Details , recommendationCtrl*",data,status);
													if(data){
														$scope.recommendationByMachineLeaning = data.Recommendation_Data;
														$rootScope.surveyDetailsList = data;
														$scope.policyUrlChartLabelTitle = undefined;
														$scope.recommendationUrlBarChartLabels = [], $scope.recommendationUrlBarChartData = [];
														$scope.recommendationAppBarChartLabels = [], $scope.recommendationUrlBarChartData = []; 
														$scope.policyAppChartLabelTitle = undefined;
														$scope.recommendationCategoryBarChartLabels = [], $scope.recommendationCategoryBarChartData = []; 
														$scope.categoryBarChartLabelTitle = undefined;
														
														$scope.recommendationSurveyGridLabel = undefined;
														$scope.recommendationPolicyStateBarLabels = [], $scope.recommendationPolicyStateBarData = [];
														
														$scope.recommendationPolicyPieChartData = [], $scope.recommendationPolicyPieChartLabels = [];
														$scope.recommendationPolicyPieChartOptions = {
																legend: {display: true,position: 'right'}
														};
														$scope.recommendationStatePieChartData = [], $scope.recommendationStatePieChartLabels = []; 
														$scope.recommendationStatePieChartOptions = {
																legend: {display: true,position: 'right'}
														};
														$scope.statePieChartLabelTitle = undefined;
														
														/**
														 * Passive_Data
														 * URL_BAR_CHART_VALUES
														 */
														$scope.recommendationURLBarDatatasetOverride = 
															[
						 								      {
						 								        label: "visit count",
						 								        borderWidth: 1,
						 								        type: 'bar'
						 								      }
						 								    ];
														if($rootScope.surveyDetailsList.Passive_Data != undefined){
															$scope.policyUrlChartLabelTitle = $rootScope.surveyDetailsList.Passive_Data.URL_BAR_CHART_LABEL;
															$scope.recommendationUrlBarChartLabels = $rootScope.surveyDetailsList.Passive_Data.URL_BAR_CHART_KEYS;
															$scope.recommendationUrlBarChartData = [$rootScope.surveyDetailsList.Passive_Data.URL_BAR_CHART_VALUES];
														}
														/**
														 * Pass_Geo_Table_Data
														 */
														if($rootScope.surveyDetailsList.Pass_Geo_Table_Data != undefined){
															/**
															 * Pass_Geo_Table_Data
															 * APP_BAR_CHART_DATA
															 */
															$scope.recommendationAppBarDatatasetOverride = 
																[
						     								      {
						     								        label: "usage count",
						     								        borderWidth: 1,
						     								        type: 'bar'
						     								      }
						     								    ];
															$scope.policyAppChartLabelTitle = $rootScope.surveyDetailsList.Pass_Geo_Table_Data.APP_BAR_CHART_LABEL;
															$scope.recommendationAppBarChartLabels = $rootScope.surveyDetailsList.Pass_Geo_Table_Data.APP_BAR_CHART_KEYS;
															$scope.recommendationAppBarChartData = [$rootScope.surveyDetailsList.Pass_Geo_Table_Data.APP_BAR_CHART_VALUES];
															/**
															 * Pass_Geo_Table_Data
															 * CATEGORY_BAR_CHART_DATA
															 */
															$scope.recommendationCategoryBarDatatasetOverride = 
																[
						     								      {
						     								        label: "category usage count",
						     								        borderWidth: 1,
						     								        type: 'bar'
						     								      }
						     								    ];
															$scope.categoryBarChartLabelTitle = $rootScope.surveyDetailsList.Pass_Geo_Table_Data.CATEGORY_BAR_CHART_LABEL;
															$scope.recommendationCategoryBarChartLabels = $rootScope.surveyDetailsList.Pass_Geo_Table_Data.CATEGORY_BAR_CHART_KEYS;
															$scope.recommendationCategoryBarChartData = [$rootScope.surveyDetailsList.Pass_Geo_Table_Data.CATEGORY_BAR_CHART_VALUES];
														}
														if($rootScope.surveyDetailsList.UBM_Profile_Data != undefined){
															
															/**
															 * Survey Grid Data
															 */
															$scope.recommendationSurveyGridLabel = $rootScope.surveyDetailsList.UBM_Profile_Data.SURVEY_GRID_LABEL;
															$scope.surveyGridTitlesList = $rootScope.surveyDetailsList.UBM_Profile_Data.Survey_GRID_titles;
															$scope.surveyGridValuesList = $rootScope.surveyDetailsList.UBM_Profile_Data.Survey_GRID_values;
															
															/*******************
															 * UBM profile chart
															 * data
															 * 
															 ******************/
																/**
																 * Chart details
																 */
															for(var i=0;i<$rootScope.surveyDetailsList.UBM_Profile_Data.POLICY_STATE_BAR_CHART_KEYS_1.length;i++){
														    	$scope.recommendationPolicyStateBarLabels[i]=($rootScope.surveyDetailsList.UBM_Profile_Data.POLICY_STATE_BAR_CHART_KEYS_0[i]).substring(0,4)+" "+($rootScope.surveyDetailsList.UBM_Profile_Data.POLICY_STATE_BAR_CHART_KEYS_1[i].substring(0,5));
														    }
														   $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
															$scope.policyStateBarChartLabelTitle = $rootScope.surveyDetailsList.UBM_Profile_Data.POLICY_STATE_BAR_CHART_LABEL;
															 $scope.recommendationPolicyStateBarData = [$rootScope.surveyDetailsList.UBM_Profile_Data.POLICY_STATE_BAR_CHART_VALUES];
														    $scope.recommendationPolicyBarDatatasetOverride = [
														      {
														        label: "POLICY STATE BAR CHART VALUES",
														        borderWidth: 1,
														        type: 'bar'
														      }
														    ];
														   
															    
															    /***************
																 * Policy pie
																 * chart details
																 */
															    $scope.policyPieChartLabelTitle = $rootScope.surveyDetailsList.UBM_Profile_Data.POLICY_PIE_CHART_LABEL;
															    $scope.recommendationPolicyPieChartData = $rootScope.surveyDetailsList.UBM_Profile_Data.POLICY_PIE_CHART_VALUES;
															    $scope.recommendationPolicyPieChartLabels = $rootScope.surveyDetailsList.UBM_Profile_Data.POLICY_PIE_CHART_KEYS;
															    
															    /***************
																 * State pie
																 * chart details
																 */
															    $scope.statePieChartLabelTitle = $rootScope.surveyDetailsList.UBM_Profile_Data.STATE_PIE_CHART_LABEL;
															    $scope.recommendationStatePieChartData = $rootScope.surveyDetailsList.UBM_Profile_Data.STATE_PIE_CHART_VALUES;
															    $scope.recommendationStatePieChartLabels = $rootScope.surveyDetailsList.UBM_Profile_Data.STATE_PIE_CHART_KEYS;
															    
														}
													}else{
														$rootScope.surveyDetailsList = [];
													}
													/***************************
													 * Navigation prev and next
													 * style and bussiness logic
													 */
													if($scope.recommendationCurrentStep == 'applyingModel'){
											        	$('#applyingModel').removeClass('current');
											        	$('#applyingModel').addClass('done');
											        	$scope.recommendationCurrentStep = 'recommendationResult';
											        	$('#recommendationResult').addClass('current');
										        	}
													
													cfpLoadingBar.complete();
													$(".disableRecommAnchor").attr("disabled",false);
													$(".disableRecommAnchor").css("pointer-events","initial");
												})
										.error(
												function(data, status) {
													cfpLoadingBar.complete();
													
													/***************************
													 * Navigation prev and next
													 * style and bussiness logic
													 */
													if($scope.recommendationCurrentStep == 'applyingModel'){
											        	$('#applyingModel').removeClass('current');
											        	$('#applyingModel').addClass('done');
											        	$scope.recommendationCurrentStep = 'recommendationResult';
											        	$('#recommendationResult').addClass('current');
										        	}
													$(".disableRecommAnchor").attr("disabled",false);
													$(".disableRecommAnchor").css("pointer-events","initial");
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
														$scope.projectList=[];
														$rootScope.loggingMessages("*Response Get Survey details Failed, recommendationCtrl*",data,status);
													}
												});
							}// end getSurveyDeails()
							
							/***************************************************
							 * @Author : bharat
							 * @Version : 1.0 ADD IN BULK
							 */
							
							$rootScope.openAddCSVReportPopup = function(){
								var size='md';
								var modalInstance = $modal
										.open({
											templateUrl : 'template/popup/addCSVReport.html',
											controller : 'recommendationPopupController',
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
							}
							$rootScope.saveCSVDataInBulk = function(){
								if(window.csvFileName != "" && window.csvFileName != undefined && window.fileObject != undefined){
									/**
									 * Do nothing
									 */
								}
								else{
									MLA_CONSTANT.TOASTR.remove();
									MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.CHOOSE_FILE,"", 
											{
												"timeOut" : "1000",
												"extendedTImeout" : "1000"
											});
									return;
								}
								if(window.csvFileData == "" || window.csvFileData == undefined){
									MLA_CONSTANT.TOASTR.remove();
									MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.CHOOSE_FILE_EMPTY,"", 
											{
												"timeOut" : "1000",
												"extendedTImeout" : "1000"
											});
									return;
								}
								var extn = csvFileName.split(".").pop();
								console.log(extn);
								if(extn == "csv" || extn == "CSV" ){
									
									/**
									 * Do nothing
									 */
									
								}else{
									MLA_CONSTANT.TOASTR.remove();
									MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.INVALIED_FILE_EXTENTION +" "+extn); 
											
									return;
								}
								
								cfpLoadingBar.start();
								$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
								if($localStorage.MlaAdminDetails != undefined)
								$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken
								var f = window.fileObject[0];
								APIServices.addCSVDataInBulk(f, 'survey')
								.success(function(data,status){
													window.csvFileData = undefined;
													window.csvFileName = undefined;
													cfpLoadingBar.complete();
													$rootScope.loggingMessages("*Response Add CSV data In Bulk, recommendationCtrl*",data,status);
													MLA_CONSTANT.TOASTR.remove();
													MLA_CONSTANT.TOASTR.success(MLA_CONSTANT_MESSAGES.CSV_FILE_UPLOAD_SUCCESS);
													$(".disableRecommAnchor").attr("disabled",false);
													$(".disableRecommAnchor").css("pointer-events","initial");
													$rootScope.cancel();
													$state.go('recommendation');
												
												})
												.error(
														function(data, status) {
															cfpLoadingBar.complete();
															if (data == null
																	|| data == '') {
																$rootScope.loggingMessages("*Response Add CSV data In Bulk Failed, recommendationCtrl*",data,status);
																MLA_CONSTANT.TOASTR.remove();
																MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.INTERNET_CONNECTION);
																$(".disableRecommAnchor").attr("disabled",true);
																$(".disableRecommAnchor").css("pointer-events","none");
															} else {
																
																$rootScope.loggingMessages("*Response Add CSV data In Bulk Failed, recommendationCtrl*",data,status);
																$(".disableRecommAnchor").attr("disabled",true);
																$(".disableRecommAnchor").css("pointer-events","none");
																$rootScope.cancel();
																MLA_CONSTANT.TOASTR.remove();
																MLA_CONSTANT.TOASTR.error(data.error.message);
															}
														});
								
								
							}
							
							/**
							 * Chart details
							 */
							/*
							 * $scope.colors = ['#45b7cd', '#ff6384',
							 * '#ff8e72'];
							 * 
							 * $scope.recommendationBarLabels = ['Monday',
							 * 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
							 * 'Saturday', 'Sunday'];
							 * $scope.recommendationBarData = [ [65, 59, 80, 81,
							 * 56, 55, 40], [28, 48, 40, 19, 86, 27, 90], ];
							 * $scope.recommendationBarDatatasetOverride = [ {
							 * label: "Bar chart", borderWidth: 1, type: 'bar' }, {
							 * label: "Line chart", borderWidth: 3,
							 * hoverBackgroundColor: "rgba(255,99,132,0.4)",
							 * hoverBorderColor: "rgba(255,99,132,1)", type:
							 * 'line' } ];
							 */
						    /**
							 * Pie Chart details
							 */
							$scope.recommendationPieLabels = ["Missing data", "Clean data", "Outliers", "Duplicate"];
							$scope.recommendationPieDetails = [20, 60, 5, 15];
							$scope.recommendationPieOptions = {
									legend: {display: true}
							};
							
							
} ]);

window.mlaApp.controller('recommendationPopupController', function($scope, $rootScope,
		$modalStack, $modalInstance, $localStorage, cfpLoadingBar ,$http, MLA_CONSTANT_MESSAGES, APIServices, $state, MLA_CONSTANT) {
 
	$rootScope.cancel = function() {

		if ($modalInstance) {
			$modalInstance.dismiss('cancel');
		}

	};
	
});
/**
 * To return only if number entered else restrict to enter character
 * 
 * @param evt
 * @returns {Boolean}
 */
function isNumber(evt) {
	 evt = (evt) ? evt : window.event;
	 var charCode = (evt.which) ? evt.which : evt.keyCode;

	 if (charCode > 31 && (charCode < 48 || charCode > 57)) {
	  return false;

	 }
	 return true;
	}

/**/

