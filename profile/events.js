// immediately return to '/' if user is not logged in
if(!getCookie(LOGIN_COOKIE_NAME))
	document.location.href = '/';

var cookieData = JSON.parse(getCookie(LOGIN_COOKIE_NAME));
var account_info = cookieData["account_info"];
var token = cookieData["token"];

$(document).ready(function() {

	// set profile image
	$(".body-profile-image").attr("src",account_info["picture"]);

	$(".body-account-name").text(account_info["name"]);

	$(".body-account-gender").text(account_info["gender"]);

	// prevent infinite click loop
	$(".body-logout-btn").click(function(){

		// delete login cookie
		deleteCookie(LOGIN_COOKIE_NAME);

		// redirect to home
		document.location.href = '/';
	});

});