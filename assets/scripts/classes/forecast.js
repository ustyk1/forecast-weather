import { ForecastStep } from './forecastStep.js';

export class ForecastManager  { 
  _daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  _daysOfTheWeekFull = ['Sunday', 'Monday', 'Tuesday', 'Wednessday', 'Thursday', 'Friday', 'Saturday'];
  _oneSecondInMilliseconds = 1000;
  _NUMBER_OF_DAYS = 5;
  _NUMBER_OF_STEPS_PER_DAY = 8;

  constructor(data) {
    this.data = data;
  }
  
  get currentDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const weekdayIndex = date.getDay();

    return `${this._daysOfTheWeekFull[weekdayIndex]} ${day}.${month}.${year}`;
  } 
  
  _limitValuesOfDaySteps(numberOfDay) {
    const from = numberOfDay * this._NUMBER_OF_STEPS_PER_DAY - this._NUMBER_OF_STEPS_PER_DAY;
    const to = numberOfDay * this._NUMBER_OF_STEPS_PER_DAY;
    
    return [from, to];
  }

  _getMinTemp(data) { 
    const minTemp = Math.min(...data.map(item => Math.round(item.main.temp_min)));
    return minTemp;
  }

  _getMaxTemp(data) { 
    const maxTemp = Math.max(...data.map(item => Math.round(item.main.temp_max)));
    return maxTemp;
  }

  get minTempOfPeriod() {
    return this._getMinTemp(this.data.list)
  }

  get maxTempOfPeriod() {
    return this._getMaxTemp(this.data.list)
  }
  
  get userLocation() {
    const { 
      name: city, 
      sunrise: sunsetTimeStampUnix, 
      sunset: sunriseTimeStampUnix 
    } = this.data.city;
    
    const sunsetTimeStampUTC = new Date(sunsetTimeStampUnix * this._oneSecondInMilliseconds);
    const sunriseTimeStampUTC = new Date(sunriseTimeStampUnix * this._oneSecondInMilliseconds);

    const sunsetHours = sunsetTimeStampUTC.getHours();
    const sunsetMinutes = sunsetTimeStampUTC.getMinutes();
    const sunriseHours = sunriseTimeStampUTC.getHours();
    const sunriseMinutes = sunriseTimeStampUTC.getMinutes();

    const sunset = `${sunsetHours}:${sunsetMinutes}`;
    const sunrise = `${sunriseHours}:${sunriseMinutes}`;

    return { city, sunset, sunrise };
  }

  get currentWeather() {
    return this.getStepByIndex(0);
  }

  _getDayOfWeek(numberOfDay) {
    const startStepIndexOfDay = numberOfDay * this._NUMBER_OF_STEPS_PER_DAY - this._NUMBER_OF_STEPS_PER_DAY;
    const datestring = (new ForecastStep(this.data.list[startStepIndexOfDay]))._date.dtText;

    const date = new Date(datestring);
    const weekdayIndex = date.getDay();

    return this._daysOfTheWeek[weekdayIndex];
  }

  _getDayIcon(numberOfDay) {
    const startStepIndexOfDay = numberOfDay * this._NUMBER_OF_STEPS_PER_DAY - this._NUMBER_OF_STEPS_PER_DAY;
    const icon = this.getStepByIndex(startStepIndexOfDay).weather.icon;
   
    return icon;
  }

  _getMinTempOfDay(numberOfDay) {
    const limit = this._limitValuesOfDaySteps(numberOfDay);
    const dayWithThreeHourStep = this.data.list.slice(...limit);
    const minTemp = this._getMinTemp(dayWithThreeHourStep);
   
    return minTemp;
  }

  _getMaxTempOfDay(numberOfDay) {
    const limit = this._limitValuesOfDaySteps(numberOfDay);
    const dayWithThreeHourStep = this.data.list.slice(...limit);
    const maxTemp = this._getMaxTemp(dayWithThreeHourStep);
    
    return maxTemp;
  }

  getStepByIndex(index) {
    const item = new ForecastStep(this.data.list[index]);
    return item;
  }

  get fiveDaysInfo() {
    const data = [];

    for (let i = 1; i <= this._NUMBER_OF_DAYS; i++) {
      data.push({
        id: this.userLocation.city,
        minTempOfDay: this._getMinTempOfDay(i),
        maxTempOfDay: this._getMaxTempOfDay(i),
        weekday: this._getDayOfWeek(i),
        icon: this._getDayIcon(i),
      });
    }

    return data;
  }

  get currentInfo() {
    return {
      cityName: this.userLocation.city,
      dateTime: this.currentDate,
      description: this.currentWeather.weather.description,
      temp: Math.round(this.currentWeather.main.temp),
      minTemp: this._getMinTempOfDay(1),
      maxTemp: this._getMaxTempOfDay(1),
    }
  }

  getTodayWeatherBySteps() {
    const steps = [];
    for (let i = 0; i <= this._NUMBER_OF_STEPS_PER_DAY; i++) {
      steps.push(this.getStepByIndex(i).weatherOfTodayStep)
    } 
    return steps
  }
}
