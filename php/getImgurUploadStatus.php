<?php
	require_once dirname(__DIR__)."/php/mysqlConnect.php";

	$filenames = json_decode($_POST["filenames"]);
	$token = $_GET['token'];
	$account_id = "";
	$fileUploadedToImgur = array();
	$fileUploadedToImgurLinks = array();

	///////////////////////////////
	/* Get account id from token */
	///////////////////////////////
	$account_id = getAccountIdFromToken($token);

	///////////////////////////////////////
	/* Get google drive id for each file */
	///////////////////////////////////////
	foreach($filenames as $filename){

		// query current file's google drive id, if any
		$result = $conn->query("SELECT imgur_link FROM Files WHERE id='".$account_id."' AND filename='" . $filename . "'");
		if (!$result)
			exit((new response(false, "SELECT call to find account failed.", null))->jsonResponse());
		$row = $result->fetch_assoc();

		// if file is uploaded to google drive
		if($row['imgur_link'] === null){
			$fileUploadedToImgur[] = false;
			$fileUploadedToImgurLinks[] = "";
		} else {
			$fileUploadedToImgur[] = true;
			$fileUploadedToImgurLinks[] = $row['imgur_link'];
		}

	}

	// return boolean flags for each file uploaded
	echo (new response(true, null, array("status" => $fileUploadedToImgur, "links" => $fileUploadedToImgurLinks)))->jsonResponse();
?>