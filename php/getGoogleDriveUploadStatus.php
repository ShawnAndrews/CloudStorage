<?php
	require_once dirname(__DIR__)."/php/mysqlConnect.php";

	$filenames = json_decode($_POST["filenames"]);
	$token = $_GET['token'];
	$account_id = "";
	$fileUploadedToGoogleDrive = array();

	///////////////////////////////
	/* Get account id from token */
	///////////////////////////////
	$account_id = getAccountIdFromToken($token);

	///////////////////////////////////////
	/* Get google drive id for each file */
	///////////////////////////////////////
	foreach($filenames as $filename){

		// query current file's google drive id, if any
		$result = $conn->query("SELECT google_drive_id FROM Files WHERE id='".$account_id."' AND filename='" . $filename . "'");
		if (!$result)
			exit((new response(false, "SELECT call to find account failed.", null))->jsonResponse());
		$row = $result->fetch_assoc();

		// if file is uploaded to google drive
		if($row['google_drive_id'] === null)
			$fileUploadedToGoogleDrive[] = false;
		else
			$fileUploadedToGoogleDrive[] = true;

	}

	// return boolean flags for each file uploaded
	echo (new response(true, null, $fileUploadedToGoogleDrive))->jsonResponse();

?>