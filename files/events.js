// immediately return to '/' if user is not logged in
if(!getCookie(LOGIN_COOKIE_NAME))
	document.location.href = '/';

$(document).ready(function () {

	// insert all files uploaded by user account
	fillFileTable();

	// handle trash icon clicks
	handleTrashClick();

});

function handleGoogleDriveUploadClick(){

	// add google drive upload button event listener
	$('.google-drive-icon.fa-upload').on('click', function() {
		
		var $icon = $(this);

		// remove upload icon
		$icon.removeClass("fa-upload");

		// add spinner icon
		$icon.addClass("fa-spinner");
		$icon.addClass("fa-spin");

		// upload file to google drive
		$.ajax({
			url: '../php/uploadToGoogleDrive.php?token=' + JSON.parse(getCookie(LOGIN_COOKIE_NAME))['token'] + '&filename=' + $icon.find("> span").text(),
			dataType: 'json',
			type: 'get',
			success: function(data){

				// error check
				if(!data['success']){
					console.log("Error: " + data['message']);
					return;
				}

				// remove spinner icon
				$icon.removeClass("fa-spinner");
				$icon.removeClass("fa-spin");

				// add check icon
				$icon.addClass("fa-check");

				// remove event listener
				$icon.off("click");

			},
			error: function(xhr, textStatus, error){
	  			console.log(xhr.statusText);
	  			console.log(textStatus);
	  			console.log(error);
			}
		});

	});

}

function handleImgurUploadClick(){

	// add imgur upload button event listener
	$('.imgur-icon.fa-upload').on('click', function() {
		
		var $icon = $(this);

		// remove upload icon
		$icon.removeClass("fa-upload");

		// add spinner icon
		$icon.addClass("fa-spinner");
		$icon.addClass("fa-spin");

		// upload file to imgur
		$.ajax({
			url: '../php/uploadToImgur.php?token=' + JSON.parse(getCookie(LOGIN_COOKIE_NAME))['token'] + '&filename=' + $icon.find("> span").text(),
			dataType: 'json',
			type: 'get',
			success: function(data){

				// error check
				if(!data['success']){

					// remove spinner icon
					$icon.removeClass("fa-spinner");
					$icon.removeClass("fa-spin");

					// add upload icon
					$icon.addClass("fa-upload");

					// show alert
					ShowAlertBox("Imgur error", "Only the following file types can be uploaded to Imgur: JPEG, PNG, GIF, APNG, TIFF, PDF, MOV, MP4, XCF.");

					console.log("Error: " + data['message']);
					return;
				}

				var imgurUploadedFileLink = data['data']['link'];

				// remove spinner icon
				$icon.removeClass("fa-spinner");
				$icon.removeClass("fa-spin");

				// add check icon
				$icon.addClass("fa-clipboard");

				// change inner span text to link
				$icon.find("> span").text(imgurUploadedFileLink);

				// remove event listener
				$icon.off("click");

				// add listener to redirect to upload link
				$icon.on('click', function() {
					// add listener
					ShowAlertBoxRequireClick("Imgur link", $icon.find("> span").text());
				});

			},
			error: function(xhr, textStatus, error){
				console.log(xhr.statusText);
	  			console.log(textStatus);
	  			console.log(error);
			}
		});

	});

}

function handleGoogleDriveUploadStatus(filenames){

	// get status of whether or not file was uploaded to google drive
	$.ajax({
		url: '../php/getGoogleDriveUploadStatus.php?token=' + JSON.parse(getCookie(LOGIN_COOKIE_NAME))['token'],
		data: { filenames: JSON.stringify(filenames) },
		dataType: 'json',
		type: 'post',
		success: function(data){

			// error check
			if(!data['success']){
				console.log("Error: " + data['message']);
				return;
			}

			var fileUploadedToGoogleDrive = data['data'];
			var fileIndex = 0;

			// for all files uploaded by user
			$(".google-drive-icon").each(function() {
				
				// find the correct row
				for(var i = 0; i < filenames.length; i++)
					if(filenames[i] == $(this).find("> span").text())
						fileIndex = i;

				// remove spinner icon
				$(this).removeClass("fa-spinner");
				$(this).removeClass("fa-spin");

				// add appropriate icon
				if(fileUploadedToGoogleDrive[fileIndex])
					$(this).addClass("fa-check");
				else
					$(this).addClass("fa-upload");

			});

			// listen to Google Drive upload clicks
			handleGoogleDriveUploadClick();

		},
		error: function(xhr, textStatus, error){
  			console.log(xhr.statusText);
  			console.log(textStatus);
  			console.log(error);
		}
	});

}

function handleImgurUploadStatus(filenames){

	// get status of whether or not file was uploaded to google drive
	$.ajax({
		url: '../php/getImgurUploadStatus.php?token=' + JSON.parse(getCookie(LOGIN_COOKIE_NAME))['token'],
		data: { filenames: JSON.stringify(filenames) },
		dataType: 'json',
		type: 'post',
		success: function(data){
			
			// error check
			if(!data['success']){
				console.log("Error: " + data['message']);
				return;
			}

			var fileUploadedToImgur = data['data']['status'];
			var fileUploadedToImgurLinks = data['data']['links'];
			var fileIndex = 0;

			// for all files uploaded by user
			$(".imgur-icon").each(function() {
				
				// find the correct row
				for(var i = 0; i < filenames.length; i++)
					if(filenames[i] == $(this).find("> span").text())
						fileIndex = i;
				
				// remove spinner icon
				$(this).removeClass("fa-spinner");
				$(this).removeClass("fa-spin");

				// add appropriate icon
				if(fileUploadedToImgur[fileIndex]){
					$(this).addClass("fa-clipboard");

					// add link to imgur upload
					$(this).find("> span").text(fileUploadedToImgurLinks[fileIndex]);

					// remove event listener
					$(this).off("click");
				} else {
					$(this).addClass("fa-upload");
				}

			});

			// add listener 
			$('.fa-clipboard').on('click', function() {
				ShowAlertBox("Imgur link", $(this).find("> span").text());
			});

			// listen to Imgur upload clicks
			handleImgurUploadClick();

		},
		error: function(xhr, textStatus, error){
  			console.log(xhr.statusText);
  			console.log(textStatus);
  			console.log(error);
		}
	});

}

function fillFileTable(){

	var filenames = [];

	// request file data associated with account
	$.ajax({
		url: '../php/getAllFiles.php?token=' + JSON.parse(getCookie(LOGIN_COOKIE_NAME))['token'],
		dataType: 'json',
		type: 'get',
		success: function(data){

			// error check
			if(!data['success']){
				console.log("Error: " + data['message']);
				return;
			}

			var files = data['data'];

			// add row to table for every file
			for(var i = 0; i < files.length; i++) {
				var filenameWithFolderPrefix = files[i].link.substr(files[i].link.indexOf("dl/") + 3);
				$(".body-files-table > tbody").append("<tr align='center'> <td>" + files[i].filename + "</td> <td>" + files[i].filesize + "</td> <td><a class='filename' href='http://" + files[i].link + "' download><div class='download-icon fa fa-cloud-download fa-3x'></div></a></td> <td>" + files[i].date + "</td> <td><div class='imgur-icon fa fa-spinner fa-spin fa-3x'><span class='invisible'>" + filenameWithFolderPrefix + "</span></div> <td><div class='google-drive-icon fa fa-spinner fa-spin fa-3x'><span class='invisible'>" + filenameWithFolderPrefix + "</span></div></td> <td><div class='trash-icon fa fa-trash fa-3x'><span class='invisible-text'>" + filenameWithFolderPrefix + "</span></div></td> </tr>");
				filenames.push(filenameWithFolderPrefix);
			}
			
			// set files google drive icon status
			handleGoogleDriveUploadStatus(filenames);

			// set files imgur icon status
			handleImgurUploadStatus(filenames);

			// update table
			$('.body-files-table').DataTable();

		},
		error: function(xhr, textStatus, error){
  			console.log(xhr.statusText);
  			console.log(textStatus);
  			console.log(error);
		}
	});

}

function handleTrashClick(){

	// delete file on trash icon click
	$('body').on('click', '.trash-icon',  function(){

		$selectedRowForDeletion = $(this).parent().closest('tr');

		// request file to be deleted
		$.ajax({
			url: '../php/deleteFile.php?token=' + JSON.parse(getCookie(LOGIN_COOKIE_NAME))['token'],
			data: { filename: $(this).find("> span").text() },
			dataType: 'json',
			type: 'post',
			success: function(data){

				// error check
				if(!data['success']){
					console.log("Error: " + data['message']);
					return;
				}

				var filename = data['data']['filename'];
				console.log(filename);
				// drop down menu
				if(!menu.expanded)
					$(".menu-container").mousedown();

				// add notification cookie
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();
				if(dd<10) dd='0'+dd
				if(mm<10) mm='0'+mm
				today = mm + '/' + dd + '/' + yyyy;
				addNotificationToCookie({ Type: "delete", Filename: filename, Date: today });

				// delete row
				$selectedRowForDeletion.remove();

				// update table
				$('.body-files-table').DataTable();

			},
			error: function(xhr, textStatus, error){
	  			console.log(xhr.statusText);
	  			console.log(textStatus);
	  			console.log(error);
			}
		});

	});
		
}