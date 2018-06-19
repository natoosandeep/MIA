window.mlaApp.controller(
				"phosphorusCtrl",
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
						'NgTableParams',
						'$timeout',
						'$filter',
						function($scope, $rootScope, $modal, $log, $state, APIServices, cfpLoadingBar, $http, $localStorage, MLA_CONSTANT_MESSAGES, MLA_CONSTANT, NgTableParams, $timeout, $filter) {
							
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
							$scope.tasks = [];
							  $scope.filtered = {};
							  for(var i = 0; i < 100; i++){
							    $scope.tasks[i] = { client_id: "" + (1 + (i % 3)), name : 'Task ' + i }
							  }
							  $scope.perPage = 20;
							  $scope.maxSize = 5;
							  $scope.setPage = function (pageNo) {
							    $scope.currentPage = pageNo;
							  };

							  $scope.$watch('searchText', function (term) {
							    var obj = term;
							    $scope.filterList = $filter('filter')($scope.tasks, obj);
							    $scope.currentPage = 1;
							  }); 
							  
							  
							$rootScope.isActive = "phosphorus";
							$scope.phosphorusCurrentStep = 'uploadCSV';
							
							$scope.editBeaconTypePerPage = 20;
							if($localStorage.MlaAdminDetails == undefined)
							{
								$state.go("login");
								return
							}
							
							$(".disablePhosphorusAnchor").attr("disabled",true);
							$(".disablePhosphorusAnchor").css("pointer-events","none");
							
							$scope.currentPhosphorusStep = function(navType){
								if($('#uploadCSV').hasClass("current")){
									$(".disablePhosphorusAnchorSkip").attr("disabled",false);
									$(".disablePhosphorusAnchorSkip").css("display","initial");
									$(".disablePhosphorusAnchor").attr("disabled",true);
									$(".disablePhosphorusAnchor").css("pointer-events","none");
									$scope.phosphorusCurrentStep = 'uploadCSV';
								}
								else if($('#dataCleaning').hasClass("current")){
									if(navType == 'prev'){
										$scope.phosphorusCurrentStep = 'phosphorusResult';
										$(".disablePhosphorusAnchor").attr("disabled",true);
										$(".disablePhosphorusAnchor").css("pointer-events","none");
										MLA_CONSTANT.TOASTR.remove();
										MLA_CONSTANT.TOASTR.error("Model already created");
										return;
									}
									$(".disablePhosphorusAnchorSkip").attr("disabled",true);
									$(".disablePhosphorusAnchorSkip").css("display","none");
									$rootScope.getPhosphorusDataCleaningList();
									$scope.phosphorusCurrentStep = 'dataCleaning';
								}
								else if($('#applyingModel').hasClass("current")){
									
									if(navType == 'next'){
										$scope.phosphorusCurrentStep = 'applyingModel';
										$rootScope.getPhosphorusGridList();
									}
									else{
										$(".disablePhosphorusAnchor").attr("disabled",true);
										$(".disablePhosphorusAnchor").css("pointer-events","none");
										MLA_CONSTANT.TOASTR.remove();
										MLA_CONSTANT.TOASTR.error("Model already created");
										return;
										
									}
								}else if($('#phosphorusResult').hasClass("current"))
									{
									$scope.phosphorusCurrentStep = 'phosphorusResult';
									
									}
								else if($('#applyingModel').hasClass("current")){
									$scope.phosphorusCurrentStep = 'applyingModel';
								}
							}
							

								
						
							$scope.selectedColumn = [];
							$scope.columnName = [ 
								{   id:1,
									label: "1",
									},
								{id:2,label: "2"},
								{id:3,label: "3"},
								{id:4,label: "4"},
								{id:5,label: "5"},
								{id:6,label: "6"},
								{id:7,label: "7"},
								{id:8,label: "8"},
								{id:9,label: "9"},
								{id:10,label: "10"},
								{id:11,label: "11"},
								];
							$scope.checkBoxSettings = { checkBoxes: true};
							$scope.isValid=true;
							$scope.filterPhosphorusGridColumn = [
								{
									id : 1,
									isValid: true
								},
								{
									id:2,
									isValid : true
								},
								{
									id : 3,
									isValid: true
								},
								{
									id:4,
									isValid : true
								},{
									id : 5,
									isValid: true
								},
								{
									id:6,
									isValid : true
								},{
									id : 7,
									isValid: true
								},
								{
									id:8,
									isValid : true
								},{
									id : 9,
									isValid: true
								},
								{
									id:10,
									isValid : true
								},{
									id : 11,
									isValid: true
								},
								
									
							]
						    
							$scope.yourEvents = {
									onItemSelect: function(item) 
									{
										for(var i=0; i<$scope.filterPhosphorusGridColumn.length;i++){
											
											if(item.id==$scope.filterPhosphorusGridColumn[i].id){
												$scope.filterPhosphorusGridColumn[i].isValid=false;
											}
										}
									},
									onItemDeselect: function(item) 
									{
										for(var i=0; i<$scope.filterPhosphorusGridColumn.length;i++){
											
											if(item.id==$scope.filterPhosphorusGridColumn[i].id){
												$scope.filterPhosphorusGridColumn[i].isValid=true;
											}
										}
										
									},
									onSelectAll: function(item) 
									{
										for(var i=0; i<$scope.filterPhosphorusGridColumn.length;i++){
											
											if(item.id==$scope.filterPhosphorusGridColumn[i].id){
												$scope.filterPhosphorusGridColumn[i].isValid=false;
											}
										}
									},
									onDeselectAll: function(item) 
									{
											for(var i=0; i<$scope.filterPhosphorusGridColumn.length;i++){
											
											if(item.id==$scope.filterPhosphorusGridColumn[i].id){
												$scope.filterPhosphorusGridColumn[i].isValid=true;
											}
									}
									
							}

							}
							
							/***************************************************
							 * API Services for phosphorusList
							 * 
							 * @version 1.0
							 * @Author-Bharat
							 * @created_date-
							 * @updated_date-
							 **************************************************/
							$scope.phosphorusLineBarChartFilter = function(startCount, endCount){
								if(startCount != undefined && endCount == undefined || endCount < 0){
									MLA_CONSTANT.TOASTR.remove();
									MLA_CONSTANT.TOASTR.error("Please enter valid end count number");
									return;
								}
								if(endCount != undefined && startCount == undefined || startCount < 0){
									MLA_CONSTANT.TOASTR.remove();
									MLA_CONSTANT.TOASTR.error("Please enter valid start count number");
									return;
								}
								if(startCount >= endCount){
									MLA_CONSTANT.TOASTR.remove();
									MLA_CONSTANT.TOASTR.error("Start count should be lesser than end count");
									return;
								}
							
								$scope.phosphorusResultLineChartLabels = [];
								if(endCount == undefined || startCount == undefined){
									endCount = Object.keys($rootScope.phosphorusListDetails.Predicted_Values_JSON_LINE_CHART_11).length;
									startCount = 0;
								}
								for(var i = startCount; i < endCount; i++){
									$scope.phosphorusResultLineChartLabels.push('Val '+ i);
								}
								$scope.phosphorusResultLineChartData = [
								     							      $rootScope.phosphorusListDetails.Actual_Values_JSON_LINE_CHART_10,
								     							     $rootScope.phosphorusListDetails.Predicted_Values_JSON_LINE_CHART_11
								     							]
							}
							
							$rootScope.getPhosphorusGridList = function(pageNo) {
									
								
								$(".disablePhosphorusAnchor").attr("disabled","disabled");
								$(".disablePhosphorusAnchor").css("pointer-events","none");
								$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
								if($localStorage.MlaAdminDetails!=undefined)
								$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken
								APIServices.getPhosphorusGridListDetails()
										.success(
												function(data, status) {
													$('#nxt').addClass('hide');
													 
													$rootScope.loggingMessages("*Response Get phosphorus grid list , phosphorusCtrl*",data,status);
													if(data){
														$rootScope.phosphorusListDetails = data;
														/***********************
														 * Phosphorus Line chart
														 * details
														 */
														$scope.phosphorusCardDetails = {
																titles: $rootScope.phosphorusListDetails.Phosphorus_Analyized_Metric_Titles,
																values: $rootScope.phosphorusListDetails.Phosphorus_Analyized_Metric_Scores
														}
														
														/**
														 * Line chart call
														 */
														$scope.phosphorusLineBarChartFilter(undefined, undefined);
														
														/***********************
														 * Phosphorus Grid List
														 * details
														 */
														var phosphorusGridDetails = [];
														$scope.phosphorusGridDetailsArray = [{HM_Mn_2 : [],
																							Inblow_P_2: [],
																							Inblow_C_3: [],
																							Inblow_Mn_4 : [],
																							EOB_Mn_5 : [],
																							TSC_TEMP_6 : [],
																							TSOP_TEMP_7: [],
																							TSOP_O_PPM_8 : [],
																							O2_2nd_Blow_9 : [],
																							Actual_Values_JSON_LINE_CHART_10 : [],
																							Predicted_Values_JSON_LINE_CHART_11 : []
														}];
														$scope.phosphorusObject1 = [];
														for(var i = 0; i<$rootScope.phosphorusListDetails.HM_Mn_1.length; i++ ){
															$scope.phosphorusObject1.push({
																	HM_Mn_2:$rootScope.phosphorusListDetails.HM_Mn_1[i],
																	Inblow_P_2: $rootScope.phosphorusListDetails.Inblow_P_2[i],
																	Inblow_C_3: $rootScope.phosphorusListDetails.Inblow_C_3[i],
																	Inblow_Mn_4 : $rootScope.phosphorusListDetails.Inblow_Mn_4[i],
																	EOB_Mn_5 : $rootScope.phosphorusListDetails.EOB_Mn_5[i],
																	TSC_TEMP_6 : $rootScope.phosphorusListDetails.TSC_TEMP_6[i],
																	TSOP_TEMP_7: $rootScope.phosphorusListDetails.TSOP_TEMP_7[i],
																	TSOP_O_PPM_8 : $rootScope.phosphorusListDetails.TSOP_O_PPM_8[i],
																	O2_2nd_Blow_9 : $rootScope.phosphorusListDetails.O2_2nd_Blow_9[i],
																	Actual_Values_JSON_LINE_CHART_10 : $rootScope.phosphorusListDetails.Actual_Values_JSON_LINE_CHART_10[i],
																	Predicted_Values_JSON_LINE_CHART_11 : $rootScope.phosphorusListDetails.Predicted_Values_JSON_LINE_CHART_11[i]
															});
															
														}
														console.log($scope.phosphorusObject1)
												}else{
														$rootScope.phosphorusListDetails = [];
													}
													$scope.phosphurusRegressionIsEmpty = undefined;
													/***************************
													 * Phosphorus nav code
													 */
													if($scope.phosphorusCurrentStep == 'applyingModel'){
											        	$('#applyingModel').removeClass('current');
											        	$('#applyingModel').addClass('done');
											        	$scope.phosphorusCurrentStep = 'phosphorusResult';
											        	$('#phosphorusResult').addClass('current');
										        	}
													
													$(".disablePhosphorusAnchor").attr("disabled",false);
													$(".disablePhosphorusAnchor").css("pointer-events","initial");
													cfpLoadingBar.complete();
												})
										.error(
												function(data, status) {
													$(".disablePhosphorusAnchor").attr("disabled",false);
													$(".disablePhosphorusAnchor").css("pointer-events","initial");
													cfpLoadingBar.complete();
													/***************************
													 * Phosphorus nav code
													 */
													if($scope.phosphorusCurrentStep == 'applyingModel'){
											        	$('#applyingModel').removeClass('current');
											        	$('#applyingModel').addClass('done');
											        	$scope.phosphorusCurrentStep = 'phosphorusResult';
											        	$('#phosphorusResult').addClass('current');
										        	}
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
														$scope.phosphurusRegressionIsEmpty = data.error.message;
														$rootScope.loggingMessages("*Response Get Phosphorus grid list Failed, beaconCtrl*",data,status);
													}
												});
							}// end getPhosphorusGridList()
							
							$rootScope.getPhosphorusDataCleaningList = function() {
								
								$(".disablePhosphorusAnchor").attr("disabled","disabled");
								$(".disablePhosphorusAnchor").css("pointer-events","none");
								cfpLoadingBar.start();
								$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
								if($localStorage.MlaAdminDetails!=undefined)
								$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken
								APIServices.getPhosphorusDataCleaning()
										.success(
												function(data, status) {
													if(data){
														
														$rootScope.phosphorusDataCleaningList = data;
														$rootScope.myImage = data;    
														$(".disablePhosphorusAnchor").attr("disabled",false);
														$(".disablePhosphorusAnchor").css("pointer-events","initial");
													}else{
														$rootScope.phosphorusDataCleaningList = [];
													}
													$scope.phosphurusRegressionIsEmpty = undefined;
													cfpLoadingBar.complete();
													$(".disablePhosphorusAnchor").attr("disabled",false);
													$(".disablePhosphorusAnchor").css("pointer-events","initial");
													
												})
										.error(
												function(data, status) {
													$(".disablePhosphorusAnchor").attr("disabled",false);
													$(".disablePhosphorusAnchor").css("pointer-events","initial");
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
														$rootScope.loggingMessages("*Response Get Phosphorus data cleaning list Failed, beaconCtrl*",data,status);
													}
												});
							}// end getPhosphorusDataCleaning()
							/***************************************************
							 * @Author : bharat
							 * @Version : 1.0 ADD IN BULK
							 */
							 
						
							 
							$rootScope.openAddCSVReportPopup = function(){
								var size='md';
								var modalInstance = $modal
										.open({
											templateUrl : 'template/popup/addCSVReport.html',
											controller : 'phosphorusPopupController',
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
								if(extn == "dcm" || extn == "DCM" ){
									
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
								APIServices.addCSVDataInBulk(f, 'phosphorusRegression')
								.success(function(data,status){
													cfpLoadingBar.complete();
													$rootScope.loggingMessages("*Response Add CSV data In Bulk, phosphorusCtrl*",data,status);
													MLA_CONSTANT.TOASTR.remove();
													MLA_CONSTANT.TOASTR.success(MLA_CONSTANT_MESSAGES.CSV_FILE_UPLOAD_SUCCESS);
													$(".disablePhosphorusAnchor").attr("disabled",false);
													$(".disablePhosphorusAnchor").css("pointer-events","initial");
													window.csvFileName = undefined;
													window.fileObject = undefined;
													$rootScope.cancel();
													$state.go('phosphorus');
												})
												.error(
														function(data, status) {
															cfpLoadingBar.complete();
															if (data == null
																	|| data == '') {
																$rootScope.loggingMessages("*Response Add CSV data In Bulk Failed, phosphorusCtrl*",data,status);
																MLA_CONSTANT.TOASTR.remove();
																MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.INTERNET_CONNECTION);
															} else {
																
																$rootScope.loggingMessages("*Response Add CSV data In Bulk Failed, phosphorusCtrl*",data,status);
																$rootScope.cancel();
																MLA_CONSTANT.TOASTR.remove();
																MLA_CONSTANT.TOASTR.error(data.error.message);
															}
														});
								
								
							}
							
							/**
							 * Chart details
							 */
							$scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
							
						    $scope.datasetOverride = [
						      {
						        label: "Actual values",
						        borderWidth: 1,
						        type: 'bar'
						      },
						      {
						        label: "Predicted values",
						        borderWidth: 3,
						        hoverBackgroundColor: "rgba(255,99,132,0.4)",
						        hoverBorderColor: "rgba(255,99,132,1)",
						        type: 'line'
						      }
						    ];
						    $scope.phosphorusResultLineOptions = {legend: {display: true}};
						    /**
							 * Pie Chart details : data cleaning
							 */
							$scope.dataCleaningOptions = {
									legend: {display: true,position: 'right'}
							};
							
							$scope.currentPage = 1;
							  $scope.pageSize = 10;
							  $scope.meals = [];
							  
							  $scope.pageChangeHandler = function(num) {
							      console.log('meals page changed to ' + num);
							  };
							  $scope.pageChangeHandler = function(num) {
							    console.log('going to page ' + num);
							  };
							  $scope.gotoDashboard = function(){
								  
								  $state.go('dashboard');
								  
							  }
							  
							  
							  
							 
} ]);


window.mlaApp.controller('phosphorusPopupController', function($scope, $rootScope,
		$modalStack, $modalInstance, $localStorage, cfpLoadingBar ,$http, MLA_CONSTANT_MESSAGES, APIServices, $state, MLA_CONSTANT) {
 
	$scope.isUpdateBeaconButtonClicked = false;
	
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


window.mlaApp.filter('start', function () {
	  return function (input, start) {
	    if (!input || !input.length) { return; }
	    start = +start;
	    return input.slice(start);
	  };
	});