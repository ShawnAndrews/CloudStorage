
var frag = window.location.hash;
var queryParameters = '?';

// replace # -> ?
queryParameters = queryParameters.concat(frag.substring(1));

// handle google login and authentication
$.ajax({
	url: '../../php/googleLogin.php' + queryParameters,
	dataType: 'json',
	type: 'post',
	success: function(data){

		// error check
		if(!data['success']){
			console.log("Error: " + data['message']);
			return;
		}

		var cookieData = data['data'];

		// set login cookie
		setLoginCookie(cookieData);

		// redirect
		window.location.replace("http://cloud.saportfolio.ca");
	},
	error: function(xhr, textStatus, error){
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
	}
});