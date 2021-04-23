require('dotenv').config()
const express = require('express');
// native node https module
const https = require('https');
// const configure = require(__dirname + '/config.js');
// const key = configure.API_KEY;


// initialize a new express app 
const app = express();
// body parser lets us grab the form data from the body
// look through the body of the post request and fetch the data based upon the name of my input i.e cityName
const bodyParser = require('body-parser');
// this code is necesssry to start parsing through the body of the post request.
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// so this is what should happen when the user
// tries to go to the home page, the root route.
app.get('/', function(req, res){
	// calling the .get method
	res.sendFile(__dirname + '/index.html'); 
	// res.send('Sever is up and running');
});
// specifying the root route
app.post('/', function(req, res) {
	console.log(req.body.cityName);
		// after the ?q in the url is the query
		// now we are able to get dynamic data by breakingit down like below based on what the user typed in the inputs
	const query = req.body.cityName;
 	// console.log('key is ' + key);


	const unit = 'metric';
	const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + process.env.API_KEY + "&q=" + query + "&units="+ unit ;
	

	// use the https module to perform a get request across the internet using the https protocol
	// we pass in a url and once we got a response back we simply log the response
	  https.get(url, function(response){
		console.log(response.statusCode);
		// response on receiving some data
		//get a hold of some data from the response and then parse the json data we get bsack into a JS object
		// then we are digging through it to get the info we want from it.
		response.on('data', function(data){
		const weatherData = JSON.parse(data);
		const temp = weatherData.main.temp
		const WeathDescription = weatherData.weather[0].description
		const icon = weatherData.weather[0].icon
		const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"; 
		// res refers to our app.get res short for(response)
		// we can only have 1 res.send in any given one of these app methods
		// the server will crash if we have more than 1
		res.write('<head><meta charset="utf-8"></head>');
		res.write(`<h3>Weather description currently ${WeathDescription}</h3>`);  
		res.write(`<h1>The temperature in ${query} is currently ${temp} Degrees Celcius</h1>`);
		// res.write(`<img src =http://openweathermap.org/img/wn/${icon}@2x.png>`);
		res.write("<img src =" + imgURL + ">");
		res.send();	
			console.log(temp);
			console.log(WeathDescription);
			// console.log(weatherData);
		});
	});
});


// listening on port 3000 and im going to add
// a call back function
app.listen(3000, function(){
	console.log	('Server running on port 3000.');
})