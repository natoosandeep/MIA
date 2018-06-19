'use strict';
window.mlaApp.factory('APIServices', [ '$http', '$rootScope','MLA_URL',
		function($http, $rootScope, MLA_URL) {

		var mlaAPI = {};
		
		mlaAPI.validateLogin = function(username, password){
			return $http({
	            method: 'POST',
	            url: MLA_URL.loginUrl,
	            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	            transformRequest: function(obj) {
	                var str = [];
	                for(var p in obj)
	                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	                return str.join("&");
	            },
	            data: {username: username, password: password}
	        });
		}
		/*******************************************************************
		 * API Services for forgot Password
		 * 
		 * @version 1.0
		 * @Author-Govind
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.forgotPassword = function(email) {
			return $http.get(MLA_URL.forgotPassword + email);
		}; // forgotPassword()
		/*******************************************************************
		 * API Services for logout
		 * 
		 * @version 1.0
		 * @Author-Govind
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.logout = function() {
			
			return $http.get(MLA_URL.logout);
		}; // logout()
		
		/*******************************************************************
		 * API Services for change Password
		 * 
		 * @version 1.0
		 * @Author-Govind
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.changePassword = function(email,oldPassword,newPassword,confirmPassword) {
			return $http.post(MLA_URL.changePassword, {
				email :email,
				oldPassword : oldPassword,
				newPassword:newPassword,
				confirmPassword:confirmPassword,
			});
		}; // changePassword()
		
		/*******************************************************************
		 * API Services for reset Password
		 * 
		 * @version 1.0
		 * @Author-Govind
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.resetPassword = function(password,confirmPassword,email) {
			return $http.put(MLA_URL.resetPassword ,{
				password :password,
				confirmPassword :confirmPassword,
				email :email
			});
		}; // resetPassword()
		/*******************************************************************
		 * API Services for get Dashboard Count
		 * @version 1.0
		 * @Author-Bharat
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.getDashboardCount = function() {
			return $http.get(MLA_URL.dashboardCount +"/");
		}; // getDashboardCount()
		
		/*******************************************************************
		 * API Services for add csv data in Bulk
		 * 
		 * @version 1.0
		 * @Author-Bharat
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.addCSVDataInBulk = function(fileObject, currentTab) {
	        var fd = new FormData();
	        fd.append('file', fileObject);
	        fd.append('currentTab', currentTab)
	        return $http({
	            method: 'POST',
	            url: MLA_URL.csvFileUploader,
	            headers: {'Content-Type': undefined},
	            data: fd
	        });
		}; // addCSVDataInBulk()
		
		/*******************************************************************
		 * API Services for get getPhosphorusDataCleaning
		 * 
		 * @version 1.0
		 * @Author-Bharat
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.getPhosphorusDataCleaning = function() {
			return $http.get(MLA_URL.getPhosphorusDataCleaning);
		}; // getPhosphorusDataCleaning()
		
		/*******************************************************************
		 * API Services for get recommendationDataCleaning
		 * 
		 * @version 1.0
		 * @Author-Vikas
		 * @created_date-30/05/2018
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.getRecommendationDataCleaning = function() {
			return $http.get(MLA_URL.getRecommendationDataCleaning);
		}; // getRecommendationDataCleaning()
		
		/*******************************************************************
		 * API Services for get anomalyDataCleaning
		 * 
		 * @version 1.0
		 * @Author-Vikas
		 * @created_date-30/05/2018
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.getAnomalyDataCleaning = function() {
			return $http.get(MLA_URL.getAnomalyDataCleaning);
		}; // getAnomalyDataCleaning()
		
		
		/*******************************************************************
		 * API Services for get Survey data
		 * 
		 * @version 1.0
		 * @Author-Bharat
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.getSurveyDetails = function(pageNumber,pageSize) {
			return $http.get(MLA_URL.getSurveyDetails);
		}; // getSurveyDetails()
		
		/*******************************************************************
		 * API Services for getPhosphorusGridListDetails
		 * 
		 * @version 1.0
		 * @Author-Bharat
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.getPhosphorusGridListDetails = function(pageNumber,pageSize) {
			return $http.get(MLA_URL.getPhosphurusRegression);
		}; // getPhosphorusGridListDetails()
		
		/*******************************************************************
		 * API Services for get sensor anomaly
		 * 
		 * @version 1.0
		 * @Author-Bharat
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.getSensorAnomaly = function() {
			return $http.get(MLA_URL.getSensorAnomaly);
		}; // getSensorAnomaly()
		
		/*******************************************************************
		 * API Services for get Dashboard count for Last seven days attendance report
		 * @version 1.0
		 * @Author-Bharat
		 * @created_date-
		 * @updated_date-
		 ******************************************************************/
		mlaAPI.dashboardLastSevenDaysAttendanceReport = function(venueId) {
			return $http.get(MLA_URL.dashboardLastSevenDaysAttendanceReport +"/"+ venueId);
		}; // dashboardLastSevenDaysAttendanceReport()
		
		/***************************************************
		 * API Services for getDashBoardData
		 * 
		 * @version 1.0
		 * @Author_Vikas
		 * @created_date-
		 * @updated_date-
		 **************************************************/
		
		mlaAPI.getDashBoardData = function() {
			return $http.get(MLA_URL.getDashBoardData);
		};
		
		return mlaAPI;
		} ]);
