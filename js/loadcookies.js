var NOTIFICATION_COOKIE_NAME = "notifications";
var LOGIN_COOKIE_NAME = "login";

$(document).ready(function () {

	// set default array cookie if no cookie set
	if(getCookie(NOTIFICATION_COOKIE_NAME) == null){
		var nowPlus1Hr = new Date();
		var time = nowPlus1Hr.getTime();
		time += 3600 * 1000;
		nowPlus1Hr.setTime(time);

		// set notifications to expire in 1 hour(logout time)
		document.cookie = NOTIFICATION_COOKIE_NAME + "=[]; expires=" + nowPlus1Hr.toUTCString() + "; path=/";
	}

	// set notification counter
	updateNotificationShine();

	// show google login button if login cookie doesnt exists
	if(!getCookie(LOGIN_COOKIE_NAME))
		$(".GoogleSignInBtn").show();

	// if not logged in, delete notifications
	if(!getCookie(LOGIN_COOKIE_NAME))
		deleteCookie(NOTIFICATION_COOKIE_NAME);

	// set blank cookie if not set
	console.log("Current notification cookie = " + getCookie(NOTIFICATION_COOKIE_NAME));
	console.log("Current login cookie = " + getCookie(LOGIN_COOKIE_NAME));

});

// set login cookie
function setLoginCookie(cookie_data) {

	var nowPlus1Hr = new Date();
	var time = nowPlus1Hr.getTime();
	time += 3600 * 1000;
	nowPlus1Hr.setTime(time);
	
	// set cookie with 1 hour expiry the same as Google login token expiration
	document.cookie = LOGIN_COOKIE_NAME + "=" + JSON.stringify(cookie_data) + "; expires=" + nowPlus1Hr.toUTCString() + "; path=/";

}

// delete cookie
function deleteCookie(COOKIE_NAME) {
	document.cookie = COOKIE_NAME + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// check if cookie exists
function getCookie(COOKIE_NAME) {
    var nameEQ = COOKIE_NAME + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

// add additional notification to existing cookie
function addNotificationToCookie(notification){
	var cookieObj = JSON.parse(Cookies.get(NOTIFICATION_COOKIE_NAME));

	// add notification
	cookieObj.push(notification);

	// update cookie
	Cookies.set(NOTIFICATION_COOKIE_NAME, cookieObj);

	// update shine flag
	updateNotificationShine();
}

// reset notification cookie
function resetNotificationCookie() {

	// reset cookie
	var nowPlus1Hr = new Date();
	var time = nowPlus1Hr.getTime();
	time += 3600 * 1000;
	nowPlus1Hr.setTime(time);
	document.cookie = NOTIFICATION_COOKIE_NAME + "=[]; expires=" + nowPlus1Hr.toUTCString() + "; path=/";

	// update shine flag
	updateNotificationShine();
}

function updateNotificationShine() {

	var counter = 0;
	var cookieObj = JSON.parse(Cookies.get(NOTIFICATION_COOKIE_NAME));

	// if not mobile or tablet, enable transitions
	if($('.menu-container').css("background-color") != "rgb(255, 255, 255)"){
		// shine menu option if any notifications
		if(cookieObj.length != 0)
			$(".menu-comment").addClass("shine");
	}

}