<?php
	require_once dirname(__DIR__)."/php/mysqlConnect.php";

	$token = $_GET['token'];
	$filename = $_GET['filename'];
	$account_id = "";
	$filenameWithoutFolder = substr($filename, strpos($filename,"/") + 1);
	$uploadedFileGoogleDriveId = "";

	///////////////////////////////
	/* Get account id from token */
	///////////////////////////////
	$account_id = getAccountIdFromToken($token);

	/////////////////////////////
	/* Validate user owns file */
	/////////////////////////////
	$result = $conn->query("SELECT COUNT(*) as filesFound FROM Files WHERE id='" . $account_id . "' AND filename='" . $filename . "'");
	if (!$result)
		exit((new response(false, "COUNT call to validate file ownership failed.", null))->jsonResponse());
	$row = $result->fetch_assoc();
	if(!$row['filesFound'])
		exit((new response(false, "Failed to verify ownership of the file by user.", null))->jsonResponse());

	////////////////////////////
	/* Upload to Google Drive */
	////////////////////////////
	$file = file_get_contents("http://cloud.saportfolio.ca/dl/" . $filename);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,            "https://www.googleapis.com/upload/drive/v3/files" );
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt($ch, CURLOPT_POST,           1 );
	curl_setopt($ch, CURLOPT_POSTFIELDS,     $file ); 
	curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Content-Type: application/x-www-form-urlencoded', 'Authorization: Bearer ' . $token)); 
	$result = json_decode(curl_exec($ch), true);
	$uploadedFileGoogleDriveId = $result['id'];

	/////////////////////////////////
	/* Rename file in Google Drive */
	/////////////////////////////////
	$data = "{'title': '" . $filenameWithoutFolder . "'}";
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, "https://www.googleapis.com/drive/v2/files/" . $uploadedFileGoogleDriveId);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PATCH');
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization: Bearer ' . $token));
	$result = json_decode(curl_exec($curl), true);
	curl_close($curl);

	/////////////////////////////////////////
	/* Update file's Google Drive id in db */
	/////////////////////////////////////////
	$result = $conn->query("UPDATE Files SET google_drive_id='" . $uploadedFileGoogleDriveId . "' WHERE filename='" . $filename . "'");
	if(!$result)
		exit((new response(false, "UPDATE call to update file's Google Drive id failed.", null))->jsonResponse());

	// return
	echo (new response(true, null, null))->jsonResponse();
?>