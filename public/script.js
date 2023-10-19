const backgroundImages = [
	'images/image-1.jpeg',
	'images/image-2.jpeg',
	'images/image-3.jpeg',
	'images/image-4.jpeg',
	'images/image-5.jpeg',
	'images/image-6.jpeg',
	'images/image-7.jpeg',
	'images/image-8.jpeg',
];

let currentImageIndex = 0;
const bgImageElement = document.querySelector('.bg-image');

function changeBackgroundImage() {
	bgImageElement.style.backgroundImage = `url(${backgroundImages[currentImageIndex]})`;
	currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
}

setInterval(changeBackgroundImage, 5000);
changeBackgroundImage();

// current location script
window.onload = () => {
	if ("geolocation" in navigator) {
		// Get the user's current position
		navigator.geolocation.getCurrentPosition(function (position) {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			console.log(`${latitude} & ${longitude}`);
			const apiKey = '1fbb5862ca36e772594480a835eff748';
			const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
			const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

			// Fetch weather data
			fetch(weatherApiUrl)
				.then(response => {
					if (response.status === 200) {
						return response.json();
					} else {
						throw new Error(`Failed to fetch weather data`);
					}
				})
				.then(data => {
					console.log(data);
					const tempInCelsius = (data.main.temp - 273.15).toFixed(2);
					const cityName = data.name;
					const degreeElem = document.querySelector(".degree");
					degreeElem.innerHTML = `${tempInCelsius}`;
					const countryElem = document.querySelector(".country");
					countryElem.innerHTML = `${cityName}`;
					const condition = data.weather[0].description;
					console.log(`${condition}`);
					const weathericn = document.querySelector('img[alt=weatherImg]');
					weathericn.style.width = '100px';
					weathericn.style.width = '100px';

					if (condition === 'clear sky') {
						weathericn.src = '/icons/animated/day.svg'
					}
					else if (condition === 'few clouds') {
						weathericn.src = '/icons/animated/cloudy.svg'
					}
					else if (condition === 'scattered clouds') {
						weathericn.src = '/icons/animated/cloudy.svg'
					}
					else if (condition === 'broken clouds') {
						weathericn.src = '/icons/animated/cloudy.svg'
					}
					else if (condition === 'shower rain') {
						weathericn.src = '/icons/animated/rainy-1.svg'
					}
					else if (condition === 'rain') {
						weathericn.src = '/icons/animated/rainy-3.svg'
					}
					else if (condition === 'thunderstorm') {
						weathericn.src = 'icons/animated/thunder.svg'
					}
					else if (condition === 'snow') {
						weathericn.src = '/icons/animated/snowy-1.svg'
					}
					else if (condition === 'mist') {
						weathericn.src = '/icons/animated/cloudy.svg'
					}
				})
				.catch(error => {
					console.error(`Weather data error:`, error);
				});
			// to handle aqi in current location
			// Fetch air quality data
			fetch(aqiUrl)
				.then(response => {
					if (response.status === 200) {
						return response.json();
					} else {
						throw new Error(`Failed to fetch air quality data`);
					}
				})
				.then(data2 => {
					const aqiJson = data2;
					console.log(aqiJson);
					const resultAqi = aqiJson.list[0].main.aqi;
					//console.log(`${resultAqi}`);
					const resAqi = document.querySelector('.dynamic');
					switch (resultAqi) {
						case 1:
							resAqi.innerHTML = `Aqi : ${resultAqi} Air Quality : Good`;
						case 2:
							resAqi.innerHTML = `Aqi : ${resultAqi} Air Quality : Fair`;
							break;

						case 3:
							resAqi.innerHTML = `Aqi : ${resultAqi} Air Quality : Moderate, Wear Mask`;
							break;

						case 4:
							resAqi.innerHTML = `Aqi : ${resultAqi} Air Quality : Poor Wear, Mask`;
							break;

						case 5:
							resAqi.innerHTML = `Aqi : ${resultAqi} Air Quality : Very Poor, Wear Mask`;
							break;

						default:
							resAqi.innerHTML = `Aqi : ${resultAqi} Current AQI is not in the defined range.`;
					}
				})
				.catch(error => {
					console.error(`Air quality data error:`, error);
				});
		});
	} else {
		alert(`Geolocation is not available in your browser`);
	}
}


// search by location script
const apikey = "1fbb5862ca36e772594480a835eff748";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

function handleFormSubmit(event) {
	event.preventDefault(); // Prevent the default form submission

	const searchTerm = document.querySelector('input[name="search"]').value;

	if (searchTerm) {
		// Construct the API URL
		const apiUrlWithKey = `${apiurl}${searchTerm}&appid=${apikey}`;
		// Make the API request
		fetch(apiUrlWithKey)
			.then(response => response.json())
			.then(data => {
				// Log the full JSON response in the console
				console.log("API Response:", data);
				// Handle the API response data
				displaySearchResults(data);

				// Access the latitude and longitude from the response
				const newLat = data.coord.lat;
				const newLong = data.coord.lon;
				const newAqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${newLat}&lon=${newLong}&appid=${apikey}`;


				// second aqi which is aqi search
				// Make the second API request inside this block
				fetch(newAqiUrl)
					.then(response => response.json())
					.then(aqiData => {
						// Log the second API response in the console
						console.log("Searched Aqi:", aqiData);
						// Handle the second API response data
						handleAnotherApiResults(aqiData);

					})
					.catch(error => {
						console.error("Error fetching data from the second API:", error);
					});
			})
			.catch(error => {
				console.error("Error fetching data:", error);
			});
	}
}

// Function to display search results
function displaySearchResults(data) {

	const temperature = data.main.temp;
	const newCity = data.name;
	const newCondition = data.weather[0].description;
	console.log(`${newCondition}`);
	console.log(`Temperature: ${temperature}°C`);
	console.log(`${newCity}`);

	const newDegreeElem = document.querySelector('.degree');
	newDegreeElem.innerHTML = `${temperature}`;
	const newCityName = document.querySelector('.country');
	newCityName.innerHTML = `${newCity}`;
	const condition = data.weather[0].description;
	const weathericn = document.querySelector('img[alt=weatherImg]');
	weathericn.style.width = '100px';
	weathericn.style.width = '100px';
	if (condition === 'clear sky') {
		weathericn.src = '/icons/animated/day.svg'
	}
	else if (condition === 'few clouds') {
		weathericn.src = '/icons/animated/cloudy.svg'
	}
	else if (condition === 'scattered clouds') {
		weathericn.src = '/icons/animated/cloudy.svg'
	}
	else if (condition === 'broken clouds') {
		weathericn.src = '/icons/animated/cloudy.svg'
	}
	else if (condition === 'shower rain') {
		weathericn.src = '/icons/animated/rainy-1.svg'
	}
	else if (condition === 'rain') {
		weathericn.src = '/icons/animated/rainy-3.svg'
	}
	else if (condition === 'thunderstorm') {
		weathericn.src = 'icons/animated/thunder.svg'
	}
	else if (condition === 'snow') {
		weathericn.src = '/icons/animated/snowy-1.svg'
	}
	else if (condition === 'mist') {
		weathericn.src = '/icons/animated/cloudy.svg'
	}

}

function handleAnotherApiResults(aqiData) {
	const newResult = aqiData.list[0].main.aqi;
	const newDynamic = document.querySelector('.dynamic');
	switch (newResult) {
		case 1:
			newDynamic.innerHTML = `Aqi : ${newResult} Air Quality : Good`;
		case 2:
			newDynamic.innerHTML = `Aqi : ${newResult} Air Quality : Fair`;
			break;

		case 3:
			newDynamic.innerHTML = `Aqi : ${newResult} Air Quality : Moderate, Wear Mask`;
			break;
		case 4:
			newDynamic.innerHTML = `Aqi : ${newResult} Air Quality : Poor Wear, Mask`;
			break;

		case 5:
			newDynamic.innerHTML = `Aqi : ${newResult} Air Quality : Very Poor, Wear Mask`;
			break;

		default:
			newDynamic.innerHTML = `Aqi : ${newResult} Current AQI is not in the defined range.`;
	}
}

// Add an event listener to the form
const searchForm = document.querySelector('.search-bar');
searchForm.addEventListener('submit', handleFormSubmit);
