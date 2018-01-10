
$(document).ready(function() {

	// handle browse files
	HandleSelectFiles();

	// handle file selection changed
	HandleFileSelectionChanged();

	// handle upload button click
	HandleUploadClick(menu);

	// handle google button click
	HandleGoogleClick();

	// prevent infinite click loop
	$(".body-upload-box-holder").click(function(e){
		e.stopPropagation();
	});

});

// handle google button click
function HandleGoogleClick(){


	$('.GoogleSignInBtn').on('click', function() {

		// Google's OAuth 2.0 endpoint for requesting an access token
		var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

		// Create <form> element to submit parameters to OAuth 2.0 endpoint.
		var form = document.createElement('form');
		form.setAttribute('method', 'GET');
		form.setAttribute('action', oauth2Endpoint);

		// Parameters to pass to OAuth 2.0 endpoint.
		var params = {
					'client_id': '736425319484-mb6v68kepclnm4ffgcog75ejlo6ufp9v.apps.googleusercontent.com',
		            'redirect_uri': 'http://cloud.saportfolio.ca/google/callback/',
		            'response_type': 'token',
		            'scope': 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file',
		            'include_granted_scopes': 'true',
		            'state': 'f8ds8f7'};

		// Add form parameters as hidden input values.
		for (var p in params) {
			var input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			input.setAttribute('name', p);
			input.setAttribute('value', params[p]);
			form.appendChild(input);
		}

		// Add form to page and submit it to open the OAuth 2.0 endpoint.
		document.body.appendChild(form);
		form.submit();
	
	});

}

// upload file(s)
function HandleUploadClick(menu){

	$('.body-upload-btn').on('click', function() {

		// immediately return to '/' if user is not logged in
		if(!getCookie(LOGIN_COOKIE_NAME)){
			ShowAlertBox("Upload", "To upload files you must login.");
			return;
		}

		// perform upload if any files selected
		if ($(".body-upload-box-holder").prop('files').length != 0) {
			
			var file_data = $('.body-upload-box-holder').prop('files');
			var file_data_len = $('.body-upload-box-holder').prop('files').length;
			var form_data = new FormData();
			
			// Append all file data to form data
			for (var i = 0; i < file_data_len; i++)
				form_data.append('userFile' + (i+1), file_data[i]);
			
			// Append number of files
			form_data.append('numOfFiles', file_data_len);
			
			// Append token
			form_data.append('token', JSON.parse(getCookie(LOGIN_COOKIE_NAME))['token']);

			// disable show and show loading animation
			$(".body-upload-btn").button('loading');

			// upload file(s) - async
			$.ajax({
				url: '/php/upload.php',
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				dataType: 'json',
				type: 'post',
				success: function(data){
					
					// error check
					if(!data['success']){
						console.log("Error: " + data['message']);
						return;
					}

					var fileInformation = data['data'];

					// for all attempted file uploads
					for (var i = 0; i < file_data_len; i++) {
						var fileSizeMb = fileInformation[i].filesize/B_TO_MB;
						
						// display file upload status box
						if(fileInformation[i].status == 0){
							ShowAlertBox("Upload failed", "One of your files is too large. Please choose another file.");
						}else if(fileInformation[i].status == 1){
							ShowAlertBox("Upload failed", "Error file name length exceeds 255 characters. Please rename file before uploading.");
						}else if(fileInformation[i].status == 2){
							ShowAlertBox("Upload failed", "IP address is limited to 5 file uploads per week. Please wait 1 week after your last upload.");
						}else{

							// if not mobile or tablet, enable transitions
							if($('.menu-container').css("background-color") != "rgb(255, 255, 255)")
								if(!menu.expanded)
									$(".menu-container").mousedown(); // drop down menu
								
							// add notification cookie
							var today = new Date();
							var dd = today.getDate();
							var mm = today.getMonth()+1; //January is 0!
							var yyyy = today.getFullYear();
							if(dd<10) dd='0'+dd
							if(mm<10) mm='0'+mm
							today = mm + '/' + dd + '/' + yyyy;
							addNotificationToCookie({ Type: "upload", Filename: fileInformation[i].filename, Date: today });
							
						}

					}

					// enable button
					$(".body-upload-btn").button('reset');

				},
				error: function(xhr, textStatus, error){
	      			console.log(xhr.statusText);
	      			console.log(textStatus);
	      			console.log(error);
	 			}
			});
		}

	});

};

function HandleFileSelectionChanged(){

	// on file selection changed
	$(".body-upload-box-holder").change(function () {
		var files = $(this)[0].files;

		// check all files against max filesize
		for (var i = 0, f; f = files[i]; i++) {
			if(f.size > MAX_FILE_SIZE){
				$(".body-upload-btn").after("<div class='alert alert-danger alertMsg'>One of your files exceeds the 50Mb limit. Please choose another file.</div>");
				return;
			}
		}

		// create/remove upload button if still no files selected 
		if(files.length > 0)
			$(".body-upload-btn").prop('disabled', false);
		else
			$(".body-upload-btn").prop('disabled', true);

     });

};

function HandleSelectFiles(){

	// delegate click to hidden element
	$(".body-upload-box").on("click", function() {
		$(".body-upload-box-holder").click();
	});

};