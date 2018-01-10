<?php
	require_once dirname(__DIR__)."/php/mysqlConnect.php";
	date_default_timezone_set('Canada/Saskatchewan');

	define('MB', 1048576);

	$MAX_UPLOADS = 5;
	$UPLOAD_COOLDOWN = 'P7D';
	$FOLDER_NAME_LEN = 15;
	$ROOT_DIRECTORY = "/home/shawn619/public_html/cloud/";
	$ROOT_DOWNLOAD = "cloud.saportfolio.ca/dl/";
	$MAX_ALLOWED_FILE_SIZE = 50*MB;
	$MAX_ALLOWED_FILENAME_LENGTH = 255;
	$exitStatus = -1;
	$filesInfo = array();
	$saskTime = date('Y-m-d H:i:s', time());
	$account_id = "";
	$token = $_POST['token'];

	///////////////////////////////
	/* Get account id from token */
	///////////////////////////////
	$account_id = getAccountIdFromToken($token);

	///////////////////////
	/* Iterate all files */
	///////////////////////
	for($i = 0; $i < $_POST['numOfFiles']; $i++) {
		$FOLDER_NAME = "";
		$unreservedFolderNameNotFound = true;
		$currentFileName = "userFile".(string)($i+1);

		/////////////////////////////
		/* Perform file validation */
		/////////////////////////////

		// Check file size
		if ($_FILES[$currentFileName]["size"] > $MAX_ALLOWED_FILE_SIZE)
			$exitStatus = 0;

		// Check file name
		if(strlen($_FILES[$currentFileName]["name"]) > $MAX_ALLOWED_FILENAME_LENGTH)
			$exitStatus = 1;

		// Query account timeout record
		$result = $conn->query("SELECT numOfUploads, lastUploadTime FROM Timeouts WHERE id='" . $account_id . "'");
		if (!$result)
			exit((new response(false, "SELECT call to get account Timeout status failed.", null))->jsonResponse());

		// if record exists
		if($result->num_rows > 0){
			$row = $result->fetch_assoc();

			// reset timeout if sufficient time elapsed
			if($row["numOfUploads"] >= $MAX_UPLOADS) {
				$uploadResetTime = new DateTime($row["lastUploadTime"]);
				$uploadResetTime->add(new DateInterval($UPLOAD_COOLDOWN));
				$currentTime = new DateTime($saskTime);
				$uploadSlotAvailable = false;
				if($uploadResetTime<=$currentTime){
					// reset downloads to zero if cooldown period elapsed and allow download
					$result = $conn->query("UPDATE Timeouts SET numOfUploads = 0 WHERE id='".$account_id."'");
					if(!$result)
						exit((new response(false, "UPDATE call to reset account's timeout record failed", null))->jsonResponse());
					$uploadSlotAvailable = true;
				}else{
					$uploadSlotAvailable = false;
				}
			}else{
				//else allow upload
				$uploadSlotAvailable = true;
			}


			// increment number of uploads
			if($uploadSlotAvailable){
				$conn->query("UPDATE Timeouts SET numOfUploads=numOfUploads + 1, lastUploadTime='".$saskTime."' WHERE id='".$account_id."'");
				if(!$result)
					exit((new response(false, "UPDATE call to increment account's timeout record failed", null))->jsonResponse());
			} else {
				$exitStatus = 2;
			}
		} else {

			// insert account timeout record
			$conn->query("INSERT INTO Timeouts (id, lastUploadTime) VALUES ('".$account_id."', '".$saskTime."')");
			if(!$result)
				exit((new response(false, "INSERT call to add account's timeout record failed.", null))->jsonResponse());
			
			// increment number of uploads
			$conn->query("UPDATE Timeouts SET numOfUploads=numOfUploads + 1, lastUploadTime='".$saskTime."' WHERE id='".$account_id."'");
			if(!$result)
				exit((new response(false, "UPDATE call to increment account's timeout record failed", null))->jsonResponse());
		}

		// Find an unreserved random folder name
		while ($unreservedFolderNameNotFound) {
			
			$FOLDER_NAME = '';
			$characters = 'aAbBcCDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789';
				
			// Generate new random folder name
			for ($j = 0; $j < $FOLDER_NAME_LEN; $j++)
				$FOLDER_NAME .= $characters[mt_rand(0, strlen($characters) - 1)];
			
			// Check if directory exists
			if (file_exists($ROOT_DIRECTORY."dl/".$FOLDER_NAME))
				$FOLDER_NAME = "";
			else
				$unreservedFolderNameNotFound = false;
		}

		// add file status information to return structure
		$filesInfo[] = array('status' => $exitStatus, 'filename' => $_FILES[$currentFileName]["name"], 'filesize' => $_FILES[$currentFileName]["size"], 'filelink' => $ROOT_DOWNLOAD.$FOLDER_NAME);
		
		// if failed validation, skip this file's upload
		if($exitStatus != -1)
			continue;

		////////////////////////////////////////////////
		/* Perform file upload to server and database */
		////////////////////////////////////////////////

		// Make folder directory to hold file
		mkdir($ROOT_DIRECTORY."dl/".$FOLDER_NAME, 0777, true);
		
		// Move file from temp location to new folder
		$moved = move_uploaded_file($_FILES[$currentFileName]["tmp_name"], $ROOT_DIRECTORY."dl/".$FOLDER_NAME."/".$_FILES[$currentFileName]["name"]);
			
		// Add file record to db
		$query = sprintf("INSERT INTO Files (id,filename,filesize,time) VALUES ('%s','%s',%d,now())",
		$account_id,
		$FOLDER_NAME."/".$_FILES[$currentFileName]['name'],
		$_FILES[$currentFileName]['size']);
		$result = $conn->query($query);
		if(!$result)
			exit((new response(false, "INSERT call to add file upload record failed.", null))->jsonResponse());

		// Add file statistics record to db
		$query = sprintf("INSERT INTO FilesStatistics (ip,id,date) VALUES ('%s','%s',now())",
		$_SERVER['REMOTE_ADDR'],
		$account_id);
		$result = $conn->query($query);
		
	}
	
	// Return status information
	echo (new response(true, null, $filesInfo))->jsonResponse();
?>