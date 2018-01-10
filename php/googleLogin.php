<?php
	require_once dirname(__DIR__)."/php/mysqlConnect.php";
	date_default_timezone_set('Canada/Saskatchewan');


	// get google account info
	function getAccountInfo($url, $token) {

		// Get cURL resource
		$curl = curl_init();

		// Set some options - we are passing in a useragent too here
		curl_setopt_array($curl, array(
		    CURLOPT_RETURNTRANSFER => 1,
		    CURLOPT_URL => $url,
		    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token]
		));

		// Send the request & save response to $resp
		$resp_json = curl_exec($curl);

		// Close request to clear up some resources
		curl_close($curl);

		$resp = json_decode($resp_json, true);
		
		if($resp['error']['code'] == 401)
			exit((new response(false, "Request to get google account metadata failed with error code 401.", null))->jsonResponse());

		return array(
			"id" => $resp['id'],
			"name" => $resp['name'],
			"picture" => $resp['picture'],
			"gender" => $resp['gender']
		);

	}

	// create account if none exists
	function handleAccountCreation($conn, $account_info){

		// get rows with matching account id's
		$result = $conn->query("SELECT COUNT(*) FROM Accounts WHERE id=".$account_info['id']);
		if (!$result)
			exit((new response(false, "SELECT call to find account failed.", null))->jsonResponse());

		// if account is not in db then create account record, else update account information
		$accountFound = $result->fetch_row()[0];
		if(!$accountFound) {
			$result = $conn->query("INSERT INTO Accounts (`id`, `name`, `picture`, `gender`) VALUES ('".$account_info['id']."', '".$account_info['name']."', '".$account_info['picture']."', '".$account_info['gender']."') ");
			if(!$result)
				exit((new response(false, "INSERT call to create account record failed.", null))->jsonResponse());
		} else {
			$result = $conn->query("UPDATE Accounts SET id='" . $account_info['id'] . "', name='" . $account_info['name'] . "', picture='" . $account_info['picture'] . "', gender='" . $account_info['gender'] . "' WHERE id='" . $account_info['id'] . "'");
			if(!$result)
				exit((new response(false, "UPDATE call to update account record failed.", null))->jsonResponse());
		}

	}

	// add account's token
	function handleToken($conn, $token, $expires_in_seconds, $account_info) {

		$tokenExpiryDate = new DateTime();
		$tokenExpiryDate->add(new DateInterval('PT' . $expires_in_seconds . 'S'));

		$result = $conn->query("INSERT INTO Tokens (`id`, `token`, `expiry_date`) VALUES ('".$account_info['id']."', '".$token."', '" . $tokenExpiryDate->format('Y-m-d H:i:s') . "' ) ");
		if(!$result)
			exit((new response(false, "INSERT call to create token record failed.", null))->jsonResponse());

	}

	$token = $_GET['access_token'];
	$expires_in_seconds = $_GET['expires_in'];
	$account_info = getAccountInfo('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', $token);

	/* ACCOUNT CREATION */
	handleAccountCreation($conn, $account_info);

	/* TOKEN UPLOAD */
	handleToken($conn, $token, $expires_in_seconds, $account_info);

	// return data to be saved in a cookie
	$cookieData = array("account_info" => $account_info, "token" => $token);
	echo (new response(true, null, $cookieData))->jsonResponse();

?>