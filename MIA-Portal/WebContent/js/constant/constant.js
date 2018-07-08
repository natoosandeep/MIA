var serviceUrl = "http://localhost:5050/";
window.mlaApp.constant('MLA_URL', {
	loginUrl : serviceUrl + "login",//"http://192.168.1.102:5050/login"
	forgotPassword : serviceUrl + "user/forgot-password/",
	logout : serviceUrl + "logout",
	resetPassword : serviceUrl + "user/saveForgotPassword",
	changePassword : serviceUrl + "user/changePassword",
	dashboardCount : serviceUrl + "beacons/getDashboardCount",
	getSurveyDetails: serviceUrl + "survey",
	getPhosphurusRegression: serviceUrl + "phosphorusRegression",  //"http://192.168.1.46:5050/phosphorusRegression",
	getSensorAnomaly: serviceUrl + "sensorAnomaly",//http://192.168.1.102:5050/sensorAnomaly
	csvFileUploader: serviceUrl + "fileUploader",
	getPhosphorusDataCleaning: serviceUrl +  "phosphorusDataCleaning", // "http://192.168.1.46:5050/phosphorusDataCleaning",
	getAnomalyDataCleaning: serviceUrl + "anomalyDataCleaning",
	getRecommendationDataCleaning: serviceUrl + "surveyDataCleaning",  // "http://192.168.1.46:5050/surveyDataCleaning"
	getDashBoardData : serviceUrl +"dashboard"
});
var toastr;
window.mlaApp.constant('MLA_CONSTANT', {
	TEST : 74,
	TOASTR : toastr
})
window.mlaApp.constant(
				'MLA_CONSTANT_MESSAGES',
				{
					USER_NOT_AUTHENTICATED : "Please login to continue.",
					INVALID_AUTH_TOKEN : "Invalid User Token",
					INTERNET_CONNECTION : "Please check if your internet connection is working and retry to continue.",
					INVALID_EMAIL : "Please enter a valid Email ID.",
					INVALID_CREDENTIALS : "Please enter valid credentials.",
					CONFIRM_PASSWORD_VALID : "Password and Confirm password must be same.",
					PASSWORD_ERROR_LENGTH : "Password must be Minimum 6 and Maximum 15 Characters.",
					PASSWORD_BLANK : "password can't be blank.",
					OLDPASSWORD_BLANK : "Old password can't be blank.",
					CONFIRMPASSWORD_BLANK : "confirm password can't be blank.",
					PASSWORD_CONFIRM_SAME_ERROR : "Password and Confirm password must be same.",
					OLD_AND_NEW_PASSWORD_SAME_ERROR_MESSAGE : "old password and new password cannot be same.",
					PASSWORD_CHANGE_SUCCESS : "Password has been changed successfully.",
					CSV_FILE_UPLOAD_SUCCESS : "File uploaded successfully.",
					BEACON_SEARCH : "Please select beacon Search By!",
					BEACON_SEARCH_VALUE : 'Please enter a valid ',
					VENUE_SEARCH : "Please select venue Search By.!",
					VENUE_SEARCH_VALUE : 'Please enter a valid ',
					ALL_FIELDS_ARE_COMPULSORY : "Please fill all mandatory fields.",
					FILED_NOT_CHANGE_SETTITNG : "Field not changed.",
					ANOTHER_USER_LOGED_IN : "Seems you or someone else has logged in using the same user credentials.",
					
					BEACON_ID : "Please enter a Valid Beacon ID.",
					BEACON_NAME : "Please enter a valid Beacon Name.",
					BEACON_NAME_VALIDATION : "Maximum character length reached!",
					BEACON_UUID : "Please enter a valid Beacon UUID.",
					BEACON_MAJOR : "Please enter a valid Beacon Major.",
					BEACON_MINOR : "Please enter a valid Beacon Minor",
					BEACON_MAJOR_MINOR_SEARCH : "Please enter valid number.!",
					CHOOSE_FILE : "Please choose file.",
					CHOOSE_FILE_EMPTY : "Selected file should not be blank.!",
				    INVALIED_FILE_EXTENTION : "Select only .dcm / .jpg / .png file, Your selected file extention is like ."
					
				})