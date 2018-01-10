var MAX_FILE_SIZE = 50000000; //50mb
var B_TO_MB = 1000000;
var FADEIN_TIME_MS = 1100;

var menu = {
	'selection': [false,false,false,false,false],
	'expanded': false
};

$(document).ready(function() {

	// fade in menu
	$('.fadein-block').fadeIn(FADEIN_TIME_MS);

	// handle menu
	HandleMenuClick(menu);

});

function HandleMenuClick(menu){

	$('.menu-container').on('mousedown', function() {
		
		// if not mobile or tablet, enable transitions
		if($('.menu-container').css("background-color") != "rgb(255, 255, 255)"){

			if (!menu.selection[0]) $(this).find('.menu-profile').css({'background-color': 'gray', 'transform': 'translate(-30px,125px)'});
			 else $(this).find('.menu-profile').css({'background-color': 'silver', 'transform': 'none'});
			if (!menu.selection[1]) $(this).find('.menu-comment').css({'background-color': 'gray', 'transform': 'translate(30px,110px)'});
			 else $(this).find('.menu-comment').css({'background-color': 'dimGray', 'transform': 'none'}); 
			if (!menu.selection[2]) $(this).find('.menu-files').css({'background-color': 'gray', 'transform': 'translate(85px,85px)'});
			 else $(this).find('.menu-files').css({'background-color': 'darkGray', 'transform': 'none'});
			if (!menu.selection[3]) $(this).find('.menu-stats').css({'background-color': 'gray', 'transform': 'translate(125px,40px)'});
			 else $(this).find('.menu-stats').css({'background-color': 'silver', 'transform': 'none'});
			if (!menu.selection[4]) $(this).find('.menu-home').css({'background-color': 'gray', 'transform': 'translate(135px,-20px)'});
			 else $(this).find('.menu-home').css({'background-color': 'silver', 'transform': 'none'});

			menu.expanded = !menu.expanded;

			menu.selection[0] = !menu.selection[0];
			menu.selection[1] = !menu.selection[1];
			menu.selection[2] = !menu.selection[2];
			menu.selection[3] = !menu.selection[3];
		  	menu.selection[4] = !menu.selection[4];

		}

	});

	$('.menu-profile').on('mousedown', function() {

		// if not logged in, show error message
		if(!getCookie(LOGIN_COOKIE_NAME)){
			ShowAlertBox("Profile alert", "You need to login before viewing your profile.");
			return;
		}
		
		document.location.href = '/profile';

	});

	$('.menu-comment').on('mousedown', function() {

		// if not logged in, show error message
		if(!getCookie(LOGIN_COOKIE_NAME)){
			ShowAlertBox("Notification alert", "You need to login before viewing your notifications.");
			return;
		}

		document.location.href = '/notifications';
	});

	$('.menu-files').on('mousedown', function() {

		// if not logged in, show error message
		if(!getCookie(LOGIN_COOKIE_NAME)){
			ShowAlertBox("Files alert", "You need to login before viewing your files.");
			return;
		}

		document.location.href = '/files';
	});

	$('.menu-stats').on('mousedown', function() {
		document.location.href = '/statistics';
	});

	$('.menu-home').on('mousedown', function() {
		document.location.href = '/';
	});

};

function ShowAlertBox(title, content){

	// show box
	$.jAlert({
		'title': title,
		'content': content,
		'theme': 'blue',
		'size': 'medium'
	});

}