var APPID = "303d0c3b957b66c8a4cb802462d0ad04"
var temp;
var loc;
var humidity;
var wind;
var direction;
var type;
var body;
var kelvin;
var weather = {};

function updateByZip(zip) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" + 
		"zip=" + zip + 
		"&APPID=" + APPID;
	sendRequest(url);
}

function updateByGeo(lat, lon){
	var url = "http://api.openweathermap.org/data/2.5/weather?" +
		"lat=" + lat + 
		"&lon=" + lon +
		"&APPID=" + APPID;
	sendRequest(url);
}

function sendRequest(url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() { //this is called a callback, talks to website
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			//var weather = {};
			kelvin = data.main.temp;
			weather.humidity = data.main.humidity;
			weather.wind = data.wind.speed;
			weather.direction = degToDirection(data.wind.deg);
			weather.loc = data.name;
			weather.temp = K2C(data.main.temp);
			weather.kelvin = data.main.temp;
			weather.type = data.weather[0].main;
			update(weather);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function K2C(k) {
	return Math.round(k - 273.15);
}
function K2F(k) {
	return Math.round(k*(9/5)-459.67);
}
function C2K(k) {
	return Math.round(k + 273.15)
}
var degs;
function degToDirection(degs) {
	if (degs <= 11.25) {
			return "N";
		} else if (degs <= 56.25) {
			return "NE";
		} else if (degs <= 123.25) {
			return "E";
		} else if (degs <= 168.75) {
			return "SE";
		} else if (degs <= 213.75) {
			return "S";
		} else if (degs <= 258.75) {
			return "SW";
		} else if (degs <= 281.25) {
			return "W";
		} else if (degs <= 326.25) {
			return "NW";
		} else if (degs > 326.25) {
			return "N";
		}
	
}
var FC = true;

function changeTemp() {
	if (FC) {
		document.getElementById("temperature").innerHTML = K2F(weather.kelvin);
		FC = false;
	} else if (!FC) {
		document.getElementById("temperature").innerHTML = K2C(weather.kelvin);
		FC = true;
	}
}

function update(weather) {
	wind.innerHTML = weather.wind;
	direction.innerHTML = weather.direction;
	humidity.innerHTML = weather.humidity;
	loc.innerHTML = weather.loc;
	temp.innerHTML = weather.temp;
	type.innerHTML = weather.type;
	if (type.innerHTML == "Clear") {
		document.body.style.backgroundImage = "url(https://static.pexels.com/photos/46160/field-clouds-sky-earth-46160.jpeg)"
	} else if (type.innerHTML == "Rain") {
		document.body.style.backgroundImage = "url(http://cdn.wallpapersafari.com/16/94/oa3LSD.jpg)"
	}
}


function showPosition(position) {
	updateByGeo(position.coords.latitude, position.coords.longitude);
}


window.onload = function() {
	temp = document.getElementById("temperature");
	loc = document.getElementById("location");
	humidity = document.getElementById("humidity");
	wind = document.getElementById("wind");
	direction = document.getElementById("direction");
	type = document.getElementById("type");


	if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		var zip = window.prompt("Could not discover your location. What is your zip code?");
		updateByZip(zip);
	}
}
