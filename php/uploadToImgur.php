<?php
	require_once dirname(__DIR__)."/php/mysqlConnect.php";

	$token = $_GET['token'];
	$filename = $_GET['filename'];
	$account_id = "";
	$filenameWithoutFolder = substr($filename, strpos($filename,"/") + 1);
	$uploadedFileImgurLink = "";
	$filenameWithFullPath = "http://cloud.saportfolio.ca/dl/" . $filename;
	$imgurClientID = "b715627a8c49f50";
	$imgurAPIUploadURL = "https://api.imgur.com/3/image";

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

	/////////////////////
	/* Upload to Imgur */
	/////////////////////
	$postBody = array("image" => $filenameWithFullPath);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,            $imgurAPIUploadURL );
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
	curl_setopt($ch, CURLOPT_POST,           1 );
	curl_setopt($ch, CURLOPT_POSTFIELDS,     $postBody ); 
	curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Authorization: Client-ID ' . $imgurClientID));
	$result = json_decode(curl_exec($ch), true);
	if($result['success'] != true)
		exit((new response(false, "HTTP request to upload file to Imgur failed with error message ".$result['data']['error']['message'], null))->jsonResponse());
	$uploadedFileImgurLink = $result['data']['link'];

	////////////////////////////////////
	/* Update file's imgur link in db */
	////////////////////////////////////
	$result = $conn->query("UPDATE Files SET imgur_link='" . $uploadedFileImgurLink . "' WHERE filename='" . $filename . "'");
	if(!$result)
		exit((new response(false, "UPDATE call to update file's imgur link failed.", null))->jsonResponse());

	// return link
	$link = array( "link" => $uploadedFileImgurLink);
	echo (new response(true, null, $link))->jsonResponse();
?>