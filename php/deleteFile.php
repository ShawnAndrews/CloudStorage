<?php
	require_once dirname(__DIR__)."/php/mysqlConnect.php";

	$fileDirectory = dirname(__DIR__)."/dl/".substr($_POST['filename'], 0, strpos($_POST['filename'], '/'));
	$account_id = "";
	$token = $_GET['token'];
	$filename = "";

	///////////////////////////////
	/* Get account id from token */
	///////////////////////////////
	$account_id = getAccountIdFromToken($token);

	// if user has uploaded any files
	$result = $conn->query("DELETE FROM Files WHERE filename='" . $_POST['filename'] . "' AND id='" . $account_id . "'");
	if (!$result)
		exit((new response(false, "DELETE call to delete file failed.", null))->jsonResponse());

	// delete directory containing folder
	array_map('unlink', glob("$fileDirectory/*.*"));
	rmdir($fileDirectory);

	// set filename without folder name
	$filename = substr($_POST['filename'], strpos($_POST['filename'], '/') + 1, strlen($_POST['filename']) - strpos($_POST['filename'], '/'));

	// return the deleted filename
	echo (new response(true, null, array("filename" => $filename)))->jsonResponse();

?>