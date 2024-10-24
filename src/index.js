import './style.css';

const rightDiv = document.querySelector('#rightDiv')
const gifDiv = document.querySelector('#gifContainer');
const hourlyDiv = document.querySelector('#hourly');

const currentTemp = document.querySelector('#current-temp');
const conditions = document.querySelector('#conditions');
const feelsLike = document.querySelector('#feels-like')
const highLow = document.querySelector('#high-and-low')
const inputLocation = document.querySelector('#location-input');
const location = document.querySelector('#location')

async function getCurrentWeather() {
  const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + inputLocation.value + '?key=XUKBP22J6BJECGNG7BAMGAX9T', { mode: 'cors' });
  const weatherData = await response.json();
  console.log(weatherData);

  //DISPLAY TEMPERATURE AND CONDITIONS IN MAIN CURRENT BLOCK
  currentTemp.textContent = convertToCelsius(weatherData.currentConditions.temp) + "°";
  conditions.textContent = weatherData.currentConditions.conditions;
  feelsLike.textContent = "Feels like: " + convertToCelsius(weatherData.currentConditions.feelslike) + "°";
  highLow.textContent = "H: " + convertToCelsius(weatherData.days[0].feelslikemax) + " L: " + convertToCelsius(weatherData.days[0].feelslikemin);

  //Update location at top of div
  location.textContent = weatherData.resolvedAddress;

  //Get and display information for hourly div
  getHourlyData(weatherData);
}

//Hourly Functions
const hourlyTemp = document.querySelectorAll('.hourlyTemp');
const hourlyTime = document.querySelectorAll('.hourlyTime');
let timeString;

function getHourlyData(weatherData) {
  for (let i = 1, k=0; i < 6; i++) {
    //Convert 00:00:00 format to X AM/PM and display
    let currentHour = parseInt(weatherData.currentConditions.datetime.split(":")[0])
    timeString = convertTime(currentHour + i);
    hourlyTime[i - 1].textContent = timeString
    console.log(currentHour + i)

    //Display temperature 
    if ((currentHour + i) > 23){
      console.log(k)
      console.log("Clock has rolled over, it is now: " + weatherData.days[1].hours[0 + k] + "AM")
      hourlyTemp[i - 1].textContent = convertToCelsius(weatherData.days[1].hours[0 + k].temp) + "°";
      k++;
    }
    else{
      console.log("using else for time: " + (currentHour + i))
      hourlyTemp[i - 1].textContent = convertToCelsius(weatherData.days[0].hours[currentHour + i].temp) + "°";
    }
  }
}

function convertToCelsius(f) {
  return Math.round((f - 32) * (5 / 9));
}

//Convert time to AM or PM 
function convertTime(currentHour) {
  let AmPm = "A.M."
  //subtract 12 hours to get time if pm
  if (currentHour > 12 && currentHour <= 24) {
    AmPm = "P.M.";
    currentHour = currentHour - 12;
  }
  else if (currentHour > 24) {
    AmPm = "A.M.";
    currentHour = currentHour - 24;
  }
  return currentHour + " " + AmPm;
}


window.storeInput = function storeInput() {
  console.log('Storing input')
  rightDiv.classList.remove('hidden')
  rightDiv.classList.add('visible')
  gifDiv.classList.remove('hidden')
  gifDiv.classList.add('visible')
  hourlyDiv.classList.remove('hidden')
  hourlyDiv.classList.add('visible')

  getCurrentWeather();
}

console.log('JS IS WORKING')

//FORM SUBMISSION
const searchForm = document.querySelector('#searchForm');

searchForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form from reloading the page
  storeInput(); // Call your function to handle the input

  const img = document.querySelector('img');
/*
  async function getCats() {
    const response = await fetch('https://api.giphy.com/v1/gifs/translate?api_key=Rh5K3XbNZfopbszfFBguJ0LHBtPRGgjA&s=beach day', { mode: 'cors' });
    const catData = await response.json();
    img.src = catData.data.images.original.url;
  }
  getCats();*/
});
