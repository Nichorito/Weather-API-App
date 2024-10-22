import './style.css';

const currentTemp = document.querySelector('#current-temp');
const conditions = document.querySelector('#conditions');
const feelsLike = document.querySelector('#feels-like')
const highLow = document.querySelector('#high-and-low')
const location = document.querySelector('#location')

async function getCurrentWeather() {
    const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/montreal?key=XUKBP22J6BJECGNG7BAMGAX9T', {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData);
    currentTemp.textContent = convertToCelsius(weatherData.currentConditions.temp) + "°";
    conditions.textContent = weatherData.currentConditions.conditions;
    feelsLike.textContent = "Feels like: " + convertToCelsius(weatherData.currentConditions.feelslike) + "°";
    highLow.textContent = "H: " + convertToCelsius(weatherData.days[0].feelslikemax) + " L: " + convertToCelsius(weatherData.days[0].feelslikemin);
    location.textContent = weatherData.resolvedAddress;
  }

function convertToCelsius(f) {
    return Math.round((f-32) * (5/9));
}

getCurrentWeather();