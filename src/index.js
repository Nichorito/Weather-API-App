import './style.css';

const rightDiv = document.querySelector('#rightDiv')
const gifDiv = document.querySelector('#gifContainer');
const hourlyDiv = document.querySelector('#hourly');

const currentTemp = document.querySelector('#current-temp');
const conditions = document.querySelector('#conditions');
const currentCondition = document.querySelector('#currentCondition');
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
  currentCondition.src = 'https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/' + weatherData.currentConditions.icon + '.png'
  feelsLike.textContent = "Feels like: " + convertToCelsius(weatherData.currentConditions.feelslike) + "°";
  highLow.textContent = "H: " + convertToCelsius(weatherData.days[0].feelslikemax) + " L: " + convertToCelsius(weatherData.days[0].feelslikemin);

  //Update location at top of div
  location.textContent = weatherData.resolvedAddress;

  //Get and display information for hourly div
  getHourlyData(weatherData);

  getObservationData(weatherData);

  //Get and display weekly data 
  getWeeklyData(weatherData)
}

//Hourly Functions
function getHourlyData(weatherData) {
  const hourlyTemp = document.querySelectorAll('.hourlyTemp');
  const hourlyTime = document.querySelectorAll('.hourlyTime');
  const hourlyConditions = document.querySelectorAll('.hourlyConditions');
  let timeString;
  
  for (let i = 1, k=0; i < 6; i++) {
    //Convert 00:00:00 format to X AM/PM and display
    let currentHour = parseInt(weatherData.currentConditions.datetime.split(":")[0])
    timeString = convertTime(currentHour + i);
    hourlyTime[i - 1].textContent = timeString
    let condition;
    
    console.log(currentHour + i)

    //Display temperature 
    if ((currentHour + i) > 23){
      console.log(k)
      console.log("Clock has rolled over, it is now: " + weatherData.days[1].hours[0 + k] + "AM")
      hourlyTemp[i - 1].textContent = convertToCelsius(weatherData.days[1].hours[0 + k].temp) + "°";
      condition = weatherData.days[1].hours[0+k].icon;
      k++;
    }
    else{
      console.log("using else for time: " + (currentHour + i))
      hourlyTemp[i - 1].textContent = convertToCelsius(weatherData.days[0].hours[currentHour + i].temp) + "°";
      condition = weatherData.days[0].hours[currentHour + i].icon;
    }
    console.log(condition);
    hourlyConditions[i-1].src = 'https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/' + condition + '.png';
  }
}

function getWeeklyData(weatherData){
  const dailyTemp = document.querySelectorAll('.dailyTemp')
  const date = document.querySelectorAll('.date');
  const dailyConditions = document.querySelectorAll('.dailyConditions')
  
  for (let i = 1, k=0; i < 8; i++) {
    console.log("day " + i)
    let formattedDate = formatDate(weatherData.days[i].datetime)
    date[i - 1].textContent = formattedDate;
    dailyTemp[i - 1].textContent = convertToCelsius(weatherData.days[i].tempmax) + "°";
    let condition = weatherData.days[i].icon;
    dailyConditions[i - 1].src = 'https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/' + condition + '.png';
    console.log(dailyConditions[i-1].src)
  }
}

function getObservationData(weatherData){
  const sunrise = document.querySelector('#sunriseP');
  const sunset = document.querySelector('#sunsetP');
  const UV = document.querySelector('#UVP');
  const humidity = document.querySelector('#humidityP');
  const wind = document.querySelector('#windP');
  const visibility = document.querySelector('#visibilityP');
  const pressure = document.querySelector('#pressureP');

  sunrise.textContent = "Sunrise: " + formatTimeHourMin(weatherData.currentConditions.sunrise);
  sunset.textContent = "Sunset: " + formatTimeHourMin(weatherData.currentConditions.sunset);
  UV.textContent = "UV Index: " + weatherData.currentConditions.uvindex;
  humidity.textContent = "Humidity: " + weatherData.currentConditions.humidity + "%";
  wind.textContent = "Wind Speed: " + weatherData.currentConditions.windspeed + " MpH";
  visibility.textContent = "Visibility: " + weatherData.currentConditions.visibility + " Miles";
  pressure.textContent = "Pressure: " + weatherData.currentConditions.pressure + " MBar";
}

function convertToCelsius(f) {
  return Math.floor((f - 32) * (5 / 9));
}

function formatDate(date){
  let dateArray = date.split("-");
  let month = dateArray[1];
  switch(month) {
    case "1":
      month = "Jan"
      break;
    case "2":
      month = "Feb"
      break;
    case "3":
      month = "Mar"
      break;
    case "4":
      month = "Apr"
      break;
    case "5":
      month = "May"
      break;
    case "6":
      month = "Jun"
      break;
    case "7":
      month = "Jul"
      break;
    case "8":
      month = "Aug"
      break;
    case "9":
      month = "Sept"
      break;
    case "10":
      month = "Oct"
      break;  
    case "11":
      month = "Nov"
      break;
    case "12":
      month = "Dec"
      break;
  }
  let day = dateArray[2];
  return month + " " + day
}

function formatTimeHourMin(time){
  let timeArray = time.split(':');
  let hour = timeArray[0];
  let minute = timeArray[1];

  return hour + ":" + minute;
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


//Button click
window.storeInput = function storeInput() {
  console.log('Storing input')
  getCurrentWeather();
  Animations();
}

const hourlySubDivs = document.querySelectorAll('.hourly-div')
const observations = document.querySelectorAll('.observation-cell')
function Animations(){
  rightDiv.classList.remove('hidden')
  rightDiv.classList.add('visible')
  gifDiv.classList.remove('hidden')
  gifDiv.classList.add('visible')
  hourlyDiv.classList.remove('hidden')
  hourlyDiv.classList.add('visible')

  for (let i = 0; i < hourlySubDivs.length; i++) {
    setTimeout(function() {
      hourlySubDivs[i].classList.remove('hidden');
      hourlySubDivs[i].classList.add('visible');
    },i * 300);
  };
  for (let i = 0; i < observations.length; i++) {
    setTimeout(function() {
      observations[i].classList.remove('hidden');
      observations[i].classList.add('visible');
    },i * 300);
  };
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
