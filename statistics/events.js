$(document).ready(function () {

 	// draw monthly chart
 	drawMonthlyChart();

	// draw country chart
	drawCountryChart();

});

 function drawMonthlyChart(){

 	var monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

	// request monthly data
	$(".monthly-chart").append("<div class='statistics-container'><p id='monthly-chart-title' class='chart'></p></div>");
	$.ajax({
		url: '/php/getMonthlyUploads.php',
		dataType: 'json',
		type: 'post',
		success: function(data){

			// error check
			if(!data['success']){
				console.log("Error: " + data['message']);
				return;
			}

			var chartData = data['data'];

			// create empty chart 
			$(".monthly-chart").after("<div class='chart-monthly-container'><canvas id='monthlyChart'></canvas></div>").remove();

			// create chart object
 			var ctx = document.getElementById("monthlyChart").getContext('2d');
			var myLineChart = new Chart(ctx, {
			    type: 'line',
			    data: {
			        labels: [monthList[chartData[5].month - 1], monthList[chartData[4].month - 1], monthList[chartData[3].month - 1], monthList[chartData[2].month - 1], monthList[chartData[1].month - 1], monthList[chartData[0].month - 1]],
			        datasets: [
			        {
			            label: 'Number of uploads',
			            data: [chartData[5].numUploads, chartData[4].numUploads, chartData[3].numUploads, chartData[2].numUploads, chartData[1].numUploads, chartData[0].numUploads],
				    	borderColor: 'yellow',
				    	borderWidth: 3,
				    	fill: false
			        },
			        {
			            label: 'Average upload size (Mb)',
			            data: [chartData[5].avgUploadSizeMb, chartData[4].avgUploadSizeMb, chartData[3].avgUploadSizeMb, chartData[2].avgUploadSizeMb, chartData[1].avgUploadSizeMb, chartData[0].avgUploadSizeMb],
				    	borderColor: 'orange',
				    	borderWidth: 3,
				    	fill: false
			        }],
				    options: {
				        
				    }
				}
			});

			// update
			Chart.defaults.global.defaultFontColor='#5bc0de';
			myLineChart.update();

		},
		error: function(xhr, textStatus, error){
  			console.log(xhr.statusText);
  			console.log(textStatus);
  			console.log(error);
			}
	});


 }

 function drawCountryChart(){

 	// request country data
	$(".country-chart").append("<div class='statistics-container'><p id='country-chart-title' class='chart'></p></div>");
	$.ajax({
		url: '/php/getCountryUploads.php',
		dataType: 'json',
		type: 'post',
		success: function(data){

			// error check
			if(!data['success']){
				console.log("Error: " + data['message']);
				return;
			}

			var chartData = data['data'];

			var config = {
		        type: 'pie',
		        data: {
		            datasets: [{
		                data: [],
		                backgroundColor: [],
		                label: 'Country data'
		            }],
		            labels: []
		        },
		        options: {
		            responsive: true
		        }
		    };

			// create chart
	    	Chart.defaults.global.defaultFontColor = "#5bc0de";
	    	$(".country-chart").after("<div class='chart-countries-container'><canvas id='countryChart'></canvas></div>").remove();
	        var ctx = document.getElementById("countryChart").getContext("2d");
	        window.myPie = new Chart(ctx, config);

	        // add data
	        for(var i = 0; i < chartData.length; i++){

	        	// add country value
	        	config.data.datasets[0].data.push(chartData[i].y);

	        	// add country color
	        	var countryColorRandom = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
	        	config.data.datasets[0].backgroundColor.push(countryColorRandom);

	        	// add country name
	        	config.data.labels.push(chartData[i].indexLabel);
	        }

	        // update chart
	        window.myPie.update();

		},
		error: function(xhr, textStatus, error){
  			console.log(xhr.statusText);
  			console.log(textStatus);
  			console.log(error);
			}
	});

 }