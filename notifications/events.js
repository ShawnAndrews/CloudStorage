// immediately return to '/' if user is not logged in
if(!getCookie(LOGIN_COOKIE_NAME))
	document.location.href = '/';

$(document).ready(function () {

	var cookieObj = null;

	// get notification cookie
	cookieObj = JSON.parse(Cookies.get(NOTIFICATION_COOKIE_NAME));
	console.log(cookieObj);
	
	// add notifications to log
	if(cookieObj.length != 0)
		for(var i = 0; i < cookieObj.length; i++)
			$(".body-panel-title").after("<div class='alert alert-info alert-msg'>" + "You have successfully performed a <i>" + cookieObj[i].Type + "</i> on the file " + cookieObj[i].Filename + " at " + cookieObj[i].Date + "</div>");
	else
		$(".body-panel-title").after("<div class='alert alert-info alert-msg'>You have no new notifications at this time.</div>");

	// delete cookie
	resetNotificationCookie();

});