import './style.css';

const currentTemp = document.querySelector('#current-weather');

async function getCurrentWeather() {
    const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/montreal?key=XUKBP22J6BJECGNG7BAMGAX9T', {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData);
    currentTemp.textContent = convertToCelsius(weatherData.currentConditions.temp);
  }

function convertToCelsius(f) {
    return Math.round((f-32) * (5/9));
}

getCurrentWeather();