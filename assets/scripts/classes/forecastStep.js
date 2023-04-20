export class ForecastStep {

  constructor(data) {
    this.item = data;
  }

  get partOfTheDay() {
    const partOfTheDay = '';
    const value = this.item.sys.pod;
    
    if (value === 'n') {
      partOfTheDay = 'night';
    } else if (value === 'd') {
      partOfTheDay = 'day';
    }

    return partOfTheDay;
  } 

  get _date() {
    const { dt, dt_txt: dtText } = this.item;
    return { dt, dtText };
  }

  get cloudiness() {
    return this.item.clouds.all;
  }
  
  get main() {
    const { 
      temp, 
      temp_min: tempMin, 
      temp_max: tempMax, 
      feels_like: feelsLike, 
      pressure, 
      humidity 
    } = this.item.main;
    return { temp, tempMin, tempMax, feelsLike, pressure, humidity };
  }

  get weather() {
    const { 
      description, 
      icon, 
      id 
    } = this.item.weather[0];
    return { description, icon, id };
  }

  get wind() {
    const { speed, gust, deg } = this.item.wind;
    return { speed, gust, deg };
  }

  get details() {
    const { sys, pop, visibility } = this.item;
    return { sys, pop, visibility };
  }

  get weatherOfTodayStep() {
    return {
      hour: (this.item.dt_txt).slice(-8, -6),
      icon: this.weather.icon,
      temp: Math.round(this.item.main.temp)
    }
  }

  get additionalInfo() {
    const {
      cloudiness, feelsLike, pressure, humidity, pop, visibility, windSpeed, wingGust, windDeg
    } = {
      cloudiness: this.cloudiness,
      feelsLike: Math.round(this.main.feelsLike), 
      pressure: this.main.pressure,
      humidity: this.main.humidity,
      pop: Math.round(this.details.pop),
      visibility:  this.details.visibility,
      windSpeed: this.wind.speed,
      wingGust: (this.wind.gust).toFixed(1),
      windDeg: this.wind.deg
    }
    return { cloudiness, feelsLike, pressure, humidity, pop, visibility, windSpeed, wingGust, windDeg }
  }
}
