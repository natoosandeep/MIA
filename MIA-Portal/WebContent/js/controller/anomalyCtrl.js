window.mlaApp.controller(
				"anomalyCtrl",
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
							$rootScope.isActive = "anomaly";
							$scope.anomalyCurrentStep = 'uploadCSV';
							
							$scope.editBeaconTypePerPage = 20;
							if($localStorage.MlaAdminDetails == undefined)
							{
								$state.go("login");
								return
							}
							$(".disableAnomalyAnchor").attr("disabled",true);
							$(".disableAnomalyAnchor").css("pointer-events","none");
							$scope.currentAnomalyStep = function(navType){
								if($('#uploadCSV').hasClass("current")){
									$scope.anomalyCurrentStep = 'uploadCSV';
									$(".disablePhosphorusAnchorSkip").attr("disabled",false);
									$(".disablePhosphorusAnchorSkip").css("display","initial");
									$(".disableAnomalyAnchor").attr("disabled",true);
									$(".disableAnomalyAnchor").css("pointer-events","none");
								}
								else if($('#dataCleaning').hasClass("current")){
									if(navType == 'prev'){
										$scope.phosphorusCurrentStep = 'anomalyResult';
										$(".disableAnomalyAnchor").attr("disabled",true);
										$(".disableAnomalyAnchor").css("pointer-events","none");
										MLA_CONSTANT.TOASTR.remove();
										MLA_CONSTANT.TOASTR.error("Model already created");
										return;
									}
									$(".disablePhosphorusAnchorSkip").attr("disabled",true);
									$(".disablePhosphorusAnchorSkip").css("display","none");
									$(".disableAnomalyAnchor").attr("disabled",false);
									$(".disableAnomalyAnchor").css("pointer-events","initial");
									$rootScope.getAnomalyDataCleaningList();
									$scope.anomalyCurrentStep = 'dataCleaning';
								}
								else if($('#applyingModel').hasClass("current")){
									$scope.anomalyCurrentStep = 'applyingModel';
									if(navType == 'next')
										$rootScope.getSensorAnomalyList();
									else{
										$scope.anomalyCurrentStep = 'anomalyResult';
										$(".disableAnomalyAnchor").attr("disabled",true);
										$(".disableAnomalyAnchor").css("pointer-events","none");
										MLA_CONSTANT.TOASTR.remove();
										MLA_CONSTANT.TOASTR.error("Model already created");
										return;
										
									}
								}else if($('#anomalyResult').hasClass("current"))
									$scope.anomalyCurrentStep = 'anomalyResult';
							}
							
							/***************************************************
							 * API Services for getAnomalyList
							 * 
							 * @version 1.0
							 * @Author-Bharat
							 * @created_date-
							 * @updated_date-
							 **************************************************/
							$rootScope.getSensorAnomalyList = function() {
								$(".disableAnomalyAnchor").attr("disabled","disabled");
								$(".disableAnomalyAnchor").css("pointer-events","none");
								cfpLoadingBar.start();
								$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
								if($localStorage.MlaAdminDetails!=undefined)
								$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken
							
								APIServices.getSensorAnomaly()
										.success(
												function(data, status) {
													$('#nxt').addClass('hide');
													$rootScope.loggingMessages("*Response Get Sensor Anomaly , anomalyCtrl*",data,status);
													if(data){
														$scope.anomalyResultDataList = data;
														$scope.anomalyResultChartReports(undefined, undefined);
													}else{
														$scope.anomalyResultDataList = [];
													}
													$scope.isAnomalyListEmpty = undefined;
													$(".disableAnomalyAnchor").attr("disabled",false);
													$(".disableAnomalyAnchor").css("pointer-events","initial");
													if($scope.anomalyCurrentStep == 'applyingModel'){
											        	$('#applyingModel').removeClass('current');
											        	$('#applyingModel').addClass('done');
											        	$scope.anomalyCurrentStep = 'anomalyResult';
											        	$('#anomalyResult').addClass('current');
										        	}
													
													cfpLoadingBar.complete();
												})
										.error(
												function(data, status) {
													$(".disableAnomalyAnchor").attr("disabled",false);
													$(".disableAnomalyAnchor").css("pointer-events","initial");
													if($scope.anomalyCurrentStep == 'applyingModel'){
											        	$('#applyingModel').removeClass('current');
											        	$('#applyingModel').addClass('done');
											        	$scope.anomalyCurrentStep = 'anomalyResult';
											        	$('#anomalyResult').addClass('current');
										        	}
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
														$scope.isAnomalyListEmpty = data.error.message;
														$rootScope.loggingMessages("*Response Get Beacon Failed, beaconCtrl*",data,status);
													}
												});
							}// end getSensorAnomaly()
							
							
							$rootScope.getAnomalyDataCleaningList = function() {
								
								$(".disableAnomalyAnchor").attr("disabled","disabled");
								$(".disableAnomalyAnchor").css("pointer-events","none");
								cfpLoadingBar.start();
								$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
								if($localStorage.MlaAdminDetails!=undefined)
								$http.defaults.headers.common['authToken'] = $localStorage.MlaAdminDetails.authToken
								APIServices.getAnomalyDataCleaning()
										.success(
												function(data, status) {
													if(data){
														
														$rootScope.anomalyDataCleaningList = data;
														$(".disableAnomalyAnchor").attr("disabled",false);
														$(".disableAnomalyAnchor").css("pointer-events","initial");
													}else{
														$rootScope.anomalyDataCleaningList = [];
													}
													$scope.anomalyRegressionIsEmpty = undefined;
													
													$(".disableAnomalyAnchor").attr("disabled",false);
													$(".disableAnomalyAnchor").css("pointer-events","initial");
													cfpLoadingBar.complete();
												})
										.error(
												function(data, status) {
													$(".disableAnomalyAnchor").attr("disabled",false);
													$(".disableAnomalyAnchor").css("pointer-events","initial");
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
														$rootScope.loggingMessages("*Response Get Anomaly data cleaning list Failed, beaconCtrl*",data,status);
													}
												});
							}// end getAnomalyDataCleaning()
							  /**
								 * Pie Chart details : data cleaning
								 */
							$scope.dataCleaningOptions = {
									legend: {display: true,position: 'right'}
							};
							
							/***************************************************
							 * @Author : bharat
							 * @Version : 1.0 ADD IN BULK
							 */
							
							$rootScope.openAddCSVReportPopup = function(){
								var size='md';
								var modalInstance = $modal
										.open({
											templateUrl : 'template/popup/addCSVReport.html',
											controller : 'anomalyPopupController',
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
								APIServices.addCSVDataInBulk(f, 'sensorAnomaly')
								.success(function(data,status){
													cfpLoadingBar.complete();
													$rootScope.loggingMessages("*Response Add CSV data In Bulk, anomalyCtrl*",data,status);
													MLA_CONSTANT.TOASTR.remove();
													MLA_CONSTANT.TOASTR.success(MLA_CONSTANT_MESSAGES.CSV_FILE_UPLOAD_SUCCESS);
													$(".disableAnomalyAnchor").attr("disabled",false);
													$(".disableAnomalyAnchor").css("pointer-events","initial");
													window.csvFileName = undefined;
													window.fileObject = undefined;
													$rootScope.cancel();
												    $state.go('anomaly');
													
												})
												.error(
														function(data, status) {
															cfpLoadingBar.complete();
															if (data == null
																	|| data == '') {
																$rootScope.loggingMessages("*Response Add CSV data In Bulk Failed, anomalyCtrl*",data,status);
																MLA_CONSTANT.TOASTR.remove();
																MLA_CONSTANT.TOASTR.error(MLA_CONSTANT_MESSAGES.INTERNET_CONNECTION);
															} else {
																
																$rootScope.loggingMessages("*Response Add CSV data In Bulk Failed, anomalyCtrl*",data,status);
																$rootScope.cancel();
																MLA_CONSTANT.TOASTR.remove();
																MLA_CONSTANT.TOASTR.error(data.error.message);
															}
														});
								
								
							}
							
							/**
							 * Stacked chart details
							 */
							$scope.resetFilter= function(){
								startCount=undefined;
								endCount=undefined;
								selectChart=undefined;
								$scope.anomalyResultChartReports(startCount,endCount,selectChart);
							}
							$scope.anomalyResultChartReports = function(startCount, endCount, selectChart){
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
								if(startCount != undefined && endCount != undefined && selectChart == undefined){
									MLA_CONSTANT.TOASTR.remove();
									MLA_CONSTANT.TOASTR.error("Please select chart");
									return;
								}
								 $scope.gotoDashboard = function(){
									  
									  $state.go('dashboard');
									  
								  }
								 $scope.charts = ["Input Current data", "Current Data", "Temp Data","Sink Temp Data","Sensor Data"];
								var start=startCount;
								var end=endCount;
								$scope.anomalyResultDataListDetails = [];
								if($scope.anomalyResultDataList.Input_Current_Chart){
									$scope.inputTitle = $scope.anomalyResultDataList.Input_Current_Chart.Input_Title;
									$scope.input_Current_Anomaly_Scatter_Points = [];
									$scope.input_Current_Data_Scatter_Points = [];
									$scope.input_Data_Scatter_labels = [];
									if(selectChart!="Input Current data"){
										startCount = undefined;
										endCount = undefined;
										}else{
										startCount = start;
										endCount = end;
									}
									if(startCount == undefined || endCount == undefined || selectChart == undefined){
										startCount = 0;
										endCount = Object.keys($scope.anomalyResultDataList.Input_Current_Chart.Input_Current_Anomaly_Bar_Chart).length;
									}
									for(var s = startCount; s < endCount; s++){
										$scope.input_Data_Scatter_labels.push('value '+ s);
										if($scope.anomalyResultDataList.Input_Current_Chart.Input_Current_Anomaly_Bar_Chart[s].isAnomaly=='yes'){
											$scope.input_Current_Anomaly_Scatter_Points.push($scope.anomalyResultDataList.Input_Current_Chart.Input_Current_Anomaly_Bar_Chart[s].value);
											$scope.input_Current_Data_Scatter_Points.push(0);
										}
										else{
											$scope.input_Current_Anomaly_Scatter_Points.push(0);
											$scope.input_Current_Data_Scatter_Points.push($scope.anomalyResultDataList.Input_Current_Chart.Input_Current_Anomaly_Bar_Chart[s].value);
										}
									}
									$scope.labels = $scope.input_Data_Scatter_labels;
								    $scope.data = [
												      $scope.input_Current_Data_Scatter_Points,
												      $scope.input_Current_Anomaly_Scatter_Points
												    ];
								    
								    $scope.anomalyResultDataListDetails.push({
										chartTitle : $scope.anomalyResultDataList.Input_Current_Chart.Input_Title,
										chartData : [
												      $scope.input_Current_Data_Scatter_Points,
												      $scope.input_Current_Anomaly_Scatter_Points
												    ],
									    chartLabel : $scope.input_Data_Scatter_labels
									});
								
								}
								
									if($scope.anomalyResultDataList.Current_Chart){
										
										$scope.current_Anomaly_Scatter_Points = [];
										$scope.current_Data_Scatter_Points = [];
										$scope.current_Data_Scatter_labels = [];
										if(selectChart!="Current Data"){
											startCount = undefined;
											endCount = undefined;
										}
										else{
											startCount = start;
											endCount = end;
										}
										if(startCount == undefined || endCount == undefined || selectChart == undefined){
											startCount = 0;
											endCount = Object.keys($scope.anomalyResultDataList.Current_Chart.Current_Data_Anomaly_Bar_Chart).length;
										}
										for(var s = startCount; s < endCount; s++){
											$scope.current_Data_Scatter_labels.push('value '+ s);
											if($scope.anomalyResultDataList.Current_Chart.Current_Data_Anomaly_Bar_Chart[s].isAnomaly=='yes'){
												$scope.current_Anomaly_Scatter_Points.push($scope.anomalyResultDataList.Current_Chart.Current_Data_Anomaly_Bar_Chart[s].value);
												$scope.current_Data_Scatter_Points.push(0);
											}
											else{
												$scope.current_Anomaly_Scatter_Points.push(0);
												$scope.current_Data_Scatter_Points.push($scope.anomalyResultDataList.Current_Chart.Current_Data_Anomaly_Bar_Chart[s].value);
											}
										}
										$scope.labels = $scope.current_Data_Scatter_labels;
									    $scope.data = [
													      $scope.current_Data_Scatter_Points,
													      $scope.current_Anomaly_Scatter_Points
													    ];
									    
									    $scope.anomalyResultDataListDetails.push({
											chartTitle : $scope.anomalyResultDataList.Current_Chart.Current_Title,
											chartData : [
													      $scope.current_Data_Scatter_Points,
													      $scope.current_Anomaly_Scatter_Points
													    ],
										    chartLabel : $scope.current_Data_Scatter_labels
										});
									
									}
									
									
									
									
									if($scope.anomalyResultDataList.Temp_Chart){
										$scope.temp_Anomaly_Scatter_Points = [];
										$scope.temp_Data_Scatter_Points = [];
										$scope.temp_Data_Scatter_labels = [];
										if(selectChart!="Temp Data"){
											startCount = undefined;
											endCount = undefined;
										}
										else{
											startCount = start;
											endCount = end;
										}
										if(startCount == undefined || endCount == undefined || selectChart == undefined){
											startCount = 0;
											endCount = Object.keys($scope.anomalyResultDataList.Temp_Chart.Temp_Data_Anomaly_Bar_Chart).length;
										}
										for(var s = startCount; s < endCount; s++){
											$scope.temp_Data_Scatter_labels.push('value '+ s);
											if($scope.anomalyResultDataList.Temp_Chart.Temp_Data_Anomaly_Bar_Chart[s].isAnomaly=='yes'){
												$scope.temp_Anomaly_Scatter_Points.push($scope.anomalyResultDataList.Temp_Chart.Temp_Data_Anomaly_Bar_Chart[s].value);
												$scope.temp_Data_Scatter_Points.push(0);
											}else{
												$scope.temp_Anomaly_Scatter_Points.push(0);
												$scope.temp_Data_Scatter_Points.push($scope.anomalyResultDataList.Temp_Chart.Temp_Data_Anomaly_Bar_Chart[s].value);
											}
										}
										
										$scope.anomalyResultDataListDetails.push({
											chartTitle : $scope.anomalyResultDataList.Temp_Chart.Temp_Title,
											chartData : [
													      $scope.temp_Data_Scatter_Points,
													      $scope.temp_Anomaly_Scatter_Points
													    ],
										    chartLabel : $scope.temp_Data_Scatter_labels
										});
									}
									if($scope.anomalyResultDataList.Heat_Sink_Temp_Chart){
										$scope.heat_Sink_Anomaly_Scatter_Points = [];
										$scope.heat_Sink_Data_Scatter_Points = [];
										$scope.heat_Sink_Data_Scatter_labels = [];
										if(selectChart!="Sink Temp Data"){
											startCount = undefined;
											endCount = undefined;
										}else{
											startCount = start;
											endCount = end;
										}
										if(startCount == undefined || endCount == undefined || selectChart == undefined){
											startCount = 0;
											endCount = Object.keys($scope.anomalyResultDataList.Heat_Sink_Temp_Chart.Heat_Sink_Temp_Anomaly_Bar_Chart).length;
										}
										for(var s = startCount; s < endCount; s++){
											$scope.heat_Sink_Data_Scatter_labels.push('value '+ s);
											if($scope.anomalyResultDataList.Heat_Sink_Temp_Chart.Heat_Sink_Temp_Anomaly_Bar_Chart[s].isAnomaly=='yes'){
												$scope.heat_Sink_Anomaly_Scatter_Points.push($scope.anomalyResultDataList.Heat_Sink_Temp_Chart.Heat_Sink_Temp_Anomaly_Bar_Chart[s].value);
												$scope.heat_Sink_Data_Scatter_Points.push(0);
											}else{
												$scope.heat_Sink_Anomaly_Scatter_Points.push(0);
												$scope.heat_Sink_Data_Scatter_Points.push($scope.anomalyResultDataList.Heat_Sink_Temp_Chart.Heat_Sink_Temp_Anomaly_Bar_Chart[s].value);
											}
										}
										
										$scope.anomalyResultDataListDetails.push({
											chartTitle : $scope.anomalyResultDataList.Heat_Sink_Temp_Chart.Heat_Sink_Temp_Title,
											chartData : [
													      $scope.heat_Sink_Data_Scatter_Points,
													      $scope.heat_Sink_Anomaly_Scatter_Points
													    ],
										    chartLabel : $scope.heat_Sink_Data_Scatter_labels
										});
									}
									if($scope.anomalyResultDataList.Engineering_Sensor){
										$scope.engi_Sensor_Anomaly_Scatter_Points = [];
										$scope.engi_Sensor_Data_Scatter_Points = [];
										$scope.engi_Sensor_Data_Scatter_labels = [];
										if(selectChart!="Sensor Data"){
											startCount = undefined;
											endCount = undefined;
										}else{
											startCount = start;
											endCount = end;
										}
										if(startCount == undefined || endCount == undefined || selectChart == undefined){
											startCount = 0;
											endCount = Object.keys($scope.anomalyResultDataList.Engineering_Sensor.Engineering_Sensor_Anomaly_Bar_Chart).length;
										}
										for(var s = startCount; s < endCount; s++){
											$scope.engi_Sensor_Data_Scatter_labels.push('value '+ s);
											if($scope.anomalyResultDataList.Engineering_Sensor.Engineering_Sensor_Anomaly_Bar_Chart[s].isAnomaly=='yes'){
												$scope.engi_Sensor_Anomaly_Scatter_Points.push($scope.anomalyResultDataList.Engineering_Sensor.Engineering_Sensor_Anomaly_Bar_Chart[s].value);
												$scope.engi_Sensor_Data_Scatter_Points.push(0);
											}else{
												$scope.engi_Sensor_Anomaly_Scatter_Points.push(0);
												$scope.engi_Sensor_Data_Scatter_Points.push($scope.anomalyResultDataList.Engineering_Sensor.Engineering_Sensor_Anomaly_Bar_Chart[s].value);
											}
										}
										
										$scope.anomalyResultDataListDetails.push({
											chartTitle : $scope.anomalyResultDataList.Engineering_Sensor.Engineering_Sensor_Title,
											chartData : [
													      $scope.engi_Sensor_Data_Scatter_Points,
													      $scope.engi_Sensor_Anomaly_Scatter_Points
													    ],
										    chartLabel : $scope.engi_Sensor_Data_Scatter_labels
										});
									}
									
								    $scope.type = 'bar';
								    $scope.series = ['Normal', 'Anomaly'];
								    $scope.options = {
								      scales: {
								        xAxes: [{
								          stacked: true,
								        }],
								        yAxes: [{
								          stacked: true
								        }]
								      },
								      legend: {
								    	  display: true
								    	 }
								    };
								    
								    $scope.colors = [
								    				
								                 	{
								                   	backgroundColor: 'gray',
								                     borderWidth: 0
								                   },
								                   {
								                   	backgroundColor: 'red',
								                     borderWidth: 0
								                   }
								    ];
							}
} ]);

window.mlaApp.controller('anomalyPopupController', function($scope, $rootScope,
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

