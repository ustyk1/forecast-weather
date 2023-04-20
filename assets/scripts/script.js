import { ForecastManager } from './classes/forecast.js'
import { Renderer } from './classes/renderer.js'
import { ERROR_MESSAGES, SELECTORS, APP_ID, DEFAULT_CITY } from './constants.js';

const $ = selector => document.querySelector(selector);
const renderer = new Renderer();

const $inpSearch = $('#inp-search');
const $btnSearch = document.querySelector('#btn-search');
const $btnClear = $('.button_close')

if (navigator.geolocation) {
  getLocation()
  .then(position => {
    const {latitude, longitude} = position.coords;
    renderPage({latitude, longitude})
  })
  .catch(error => {
    console.log('Error:', error);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('error.PERMISSION_DENIED');
          displayErrorMsg(ERROR_MESSAGES.PERMISSION_DENIED);
          renderPage(DEFAULT_CITY);
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('error.POSITION_UNAVAILABLE');
        displayErrorMsg(ERROR_MESSAGES.POSITION_UNAVAILABLE);
        renderPage(DEFAULT_CITY);
        break;
      case error.UNKNOWN_ERROR:
        displayErrorMsg(ERROR_MESSAGES.UNKNOWN_ERROR);
        break;
      }
  });
} else {
  renderPage(DEFAULT_CITY);
}

$btnSearch.addEventListener('click', () => {
  renderer.clearContent();
  hideErrorMsgBox();

  const userCity = $('#inp-search').value;

  if (!userCity) {
    renderer.displayMessageBox(ERROR_MESSAGES.EMPTY);
    return;
  }

  renderPage(userCity);
})

$btnClear.addEventListener('click', () => {
  $inpSearch.value = '';
  hideErrorMsgBox();
})

//* ------------- FUNCTIONS -------------

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error)
    );
  });
}

async function fetchForecast(url) {
  try {
    const response = await fetch(url);
    if (response.status === 404) throw new Error('City not found!');
    if (response.status === 400) throw new Error('Invalid search request!');

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

function renderPage(location) {
  fetchForecast(generateUrl(location))
  .then(data => {
    renderPageSections(data);
  })
  .catch(error => {
    console.log('Error:', error);
    displayErrorMsg(ERROR_MESSAGES.NOT_FOUND);
    renderer.clearContent();
  })
}

function displayErrorMsg(errorMessage) {
  renderer.displayMessageBox(errorMessage);
}

function hideErrorMsgBox() {
  $(SELECTORS.ERROR_MSG_BOX).innerHTML = '';
}

function generateUrl(location) {
  const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  const queryParams = {
    units: 'metric', 
    limit: 5,
    appid: APP_ID
  };

  if (typeof location === 'string') {
    queryParams.q = location;
  } else if (typeof location === 'object') {
    queryParams['lat'] = location.latitude;
    queryParams['lon'] = location.longitude;
  }

  return `${baseUrl}?${new URLSearchParams(queryParams)}` 
}

function renderPageSections(data) {
  const forecastManager = new ForecastManager(data)
  const renderer = new Renderer();

  renderer.displayCurrentInfoBlock(forecastManager.currentInfo)
  renderer.displayTodayWeaterBlock(forecastManager.getTodayWeatherBySteps())
  renderer.displayFiveDaysWeatherBlock(
    forecastManager.fiveDaysInfo, 
    forecastManager.minTempOfPeriod, 
    forecastManager.maxTempOfPeriod
  );
  renderer.updateDetailsBlock(forecastManager.currentWeather.additionalInfo, forecastManager.userLocation);
}

