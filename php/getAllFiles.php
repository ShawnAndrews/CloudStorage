<?php
	require_once dirname(__DIR__)."/php/mysqlConnect.php";
	
	$kbToMb = 1000000;
	$DL_DIRECTORY_PREFIX = $_SERVER['SERVER_NAME'] . '/dl';
	$returnFiles = array();
	$account_id = "";
	$token = $_GET['token'];

	///////////////////////////////
	/* Get account id from token */
	///////////////////////////////
	$account_id = getAccountIdFromToken($token);

	// get file data
	$result = $conn->query("SELECT filename, filesize, time FROM Files WHERE id='" . $account_id . "'");
	if(!$result)
		exit((new response(false, "SELECT call to get file data failed.", null))->jsonResponse());

	// for every file
	while ($row = $result->fetch_assoc()) {

		$filesizeInMb = sprintf('%0.2f', $row['filesize']/$kbToMb) . " Mbs";
		$filenameWithoutFolderPrefix = substr($row['filename'], strpos($row['filename'], '/') + 1);
		$filenameWithFolderAndDomainPrefix = $DL_DIRECTORY_PREFIX . "/" . $row['filename'];

		// add file data
		$returnFiles[] = array('filename'=>$filenameWithoutFolderPrefix, 'filesize'=>$filesizeInMb, 'link'=>$filenameWithFolderAndDomainPrefix, 'date'=>$row['time']);

	}

	// return file data
	echo (new response(true, null, $returnFiles))->jsonResponse();

?>