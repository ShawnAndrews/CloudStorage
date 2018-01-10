<?php
	require_once dirname(__DIR__)."/php/mysqlConnect.php";
	
	$B_TO_MB = 1000000;
	$NUM_PAST_MONTHS = 6;
	$FILESIZE_DECIMAL_PLACE = 2;

	// add past 6 months
	$chartData = array();
	$chartData[] = array("month" => (int)date('m'), "numUploads" => 0, "avgUploadSizeMb" => 0);
	$chartData[] = array("month" => (int)gmdate("m", strtotime("-1 month")), "numUploads" => 0, "avgUploadSizeMb" => 0);
	$chartData[] = array("month" => (int)gmdate("m", strtotime("-2 month")), "numUploads" => 0, "avgUploadSizeMb" => 0);
	$chartData[] = array("month" => (int)gmdate("m", strtotime("-3 month")), "numUploads" => 0, "avgUploadSizeMb" => 0);
	$chartData[] = array("month" => (int)gmdate("m", strtotime("-4 month")), "numUploads" => 0, "avgUploadSizeMb" => 0);
	$chartData[] = array("month" => (int)gmdate("m", strtotime("-5 month")), "numUploads" => 0, "avgUploadSizeMb" => 0);

	// query all files in last month
	$result = $conn->query("SELECT time, filesize FROM Files WHERE (time > '".gmdate("Y-m-d", strtotime("-6 month"))."' AND time < '".gmdate("Y-m-d", strtotime("+1 day"))."')");
	if (!$result)
		exit((new response(false, "SELECT to get file data failed", null))->jsonResponse());

	// for all files, aggregate statistics
	while ($row = $result->fetch_assoc()) {
		if(($row["time"] > gmdate("Y-m-d", strtotime("-1 month"))) && ($row["time"] < gmdate("Y-m-d", strtotime("+1 day")))) {
			$chartData[0]["numUploads"]++;
			$chartData[0]["avgUploadSizeMb"] += $row["filesize"];
		}else if(($row["time"] > gmdate("Y-m-d", strtotime("-2 month"))) && ($row["time"] < gmdate("Y-m-d", strtotime("-1 month")))){
			$chartData[1]["numUploads"]++;
			$chartData[1]["avgUploadSizeMb"] += $row["filesize"];
		}else if(($row["time"] > gmdate("Y-m-d", strtotime("-3 month"))) && ($row["time"] < gmdate("Y-m-d", strtotime("-2 month")))){
			$chartData[2]["numUploads"]++;
			$chartData[2]["avgUploadSizeMb"] += $row["filesize"];
		}else if(($row["time"] > gmdate("Y-m-d", strtotime("-4 month"))) && ($row["time"] < gmdate("Y-m-d", strtotime("-3 month")))){
			$chartData[3]["numUploads"]++;
			$chartData[3]["avgUploadSizeMb"] += $row["filesize"];
		}else if(($row["time"] > gmdate("Y-m-d", strtotime("-5 month"))) && ($row["time"] < gmdate("Y-m-d", strtotime("-4 month")))){
			$chartData[4]["numUploads"]++;
			$chartData[4]["avgUploadSizeMb"] += $row["filesize"];
		}else if(($row["time"] > gmdate("Y-m-d", strtotime("-6 month"))) && ($row["time"] < gmdate("Y-m-d", strtotime("-5 month")))){
			$chartData[5]["numUploads"]++;
			$chartData[5]["avgUploadSizeMb"] += $row["filesize"];
		}
	}

	// get average filesize and convert to mb
	for($i = 0; $i < $NUM_PAST_MONTHS; $i++)
		if($chartData[$i]["numUploads"] != 0)
			$chartData[$i]["avgUploadSizeMb"] = round(((int)($chartData[$i]["avgUploadSizeMb"]/$chartData[$i]["numUploads"]))/$B_TO_MB, $FILESIZE_DECIMAL_PLACE);

	// return monthly chart data
	echo (new response(true, null, $chartData))->jsonResponse();
?>