import { SELECTORS } from "../constants.js";

export class Renderer {
  _indicatorLength = 110;

  constructor() {}

  _$(selector) {
    return document.querySelector(selector);
  }

  _calcNumberOfIndicatorParts(minTempValue, maxTempValue) {
    const numberOfIndicatorParts = maxTempValue - minTempValue;
    return numberOfIndicatorParts;
  }

  _setIndicatorStyle({minTempOfDay, maxTempOfDay, minTemp, maxTemp}) {
    const numberOfIndicatorParts = this._calcNumberOfIndicatorParts(minTemp, maxTemp);
    const onePartLength = (this._indicatorLength / numberOfIndicatorParts).toFixed(3);
  
    const borderLeftWidth = (onePartLength * (minTempOfDay - minTemp)) + 'px';
    const borderRightWidth = (onePartLength * (maxTemp - maxTempOfDay)) +'px';
  
    const styles = [
      { name: "border-left-width", value: borderLeftWidth },
      { name: "border-right-width", value: borderRightWidth }
    ]

    let styleString = "";
    for (let i = 0; i < styles.length; i++) {
      styleString += `${styles[i].name}: ${styles[i].value}; `;
    }

    return styleString;
  }

  displayTodayWeaterBlock(steps) {
    let counter = 0;
    const container = this._$(SELECTORS.CONTAINER);

    const wrapper = document.createElement("div");
    wrapper.classList.add("today-weather-wrapper");

    const content = steps.map(({hour, icon, temp}) => {
      ++counter;
      let time = '';
      if (counter === 1) time = 'Now';
      return `
      <li class="today__step step">
      <div class="step__hour">${time || hour}</div>
      <div class="step__icon"><img alt="Weather Icon" src="https://openweathermap.org/img/wn/${icon}@2x.png"></div>
      <div class="step__temp">${temp}&deg;</div>
      </li>
      `
    }).join('');
    
    wrapper.innerHTML = `<ul class="today-weather today box">${content}</ul>`;
    container.append(wrapper);
  }

  displayFiveDaysWeatherBlock(days, minTemp, maxTemp) {
    let counter = 0;
    const container = this._$(SELECTORS.CONTAINER);

    const wrapper = document.createElement("ul");
    wrapper.classList.add("five-days-weather", "days", "box");

    wrapper.innerHTML  = days.map(({ id, minTempOfDay, maxTempOfDay, weekday, icon }) => {
      ++counter;
      let day = '';
      
      if (counter === 1) day = 'Today';

      const indicatorStyle = this._setIndicatorStyle({minTempOfDay, maxTempOfDay, minTemp, maxTemp});

      return `
        <li class="days__day day" data-day="${id}-${counter}">
          <div class="day__date">${day || weekday}</div>
          <div class="day__icon"><img alt="" src="https://openweathermap.org/img/wn/${icon}@2x.png"></div>
          <div class="day__min-temp">${minTempOfDay}&deg;</div>
          <div class="day__indicator">
            <div style="${indicatorStyle}"></div>
          </div>
          <div class="day__max-temp">${maxTempOfDay}&deg;</div>
        </li>
      `
    }).join('');
    container.append(wrapper);
  }

  updateDetailsBlock({ 
    cloudiness, 
    feelsLike, 
    pressure, 
    humidity, 
    pop, 
    visibility, 
    windSpeed, 
    wingGust, 
    windDeg 
  },{city, sunset, sunrise}) {
    const container = this._$(SELECTORS.CONTAINER);
    const wrapper = document.createElement("ul");
    wrapper.classList.add("details");
    
    wrapper.innerHTML = `
      <li class="box details__pop detail">
        <h4 class="detail__name">
          <div style="background-image: url(./assets/svg/water-icon.svg)"></div>
          <span>probability of</span>
          <span> precipitation</span>
        </h4>
        <p class="detail__value">${pop} %</p>
      </li>
      <li class="box details__sun detail">
        <h4 class="detail__name">
          <div style="background-image: url(./assets/svg/sun-icon.svg)"></div>
          sun
        </h4>
        <p class="detail__value detail__value_sunrise">${sunset}</p>
        <p class="detail__value detail__value_sunset">${sunrise}</p>
        <p class="detail__comment"></p>
      </li>
      <li class="box details__wind detail">
        <h4 class="detail__name">
          <div style="background-image: url(./assets/svg/wind-icon.svg)"></div>
          wind
        </h4>
        <div class="compass-wrapper">
          <div class="compass">
            <img src="./assets/svg/compass.svg" alt="Compass">
            <img src="./assets/svg/arrow.svg" alt="Compass arrow" class="compass__arrow"
            style="transform: rotate(${windDeg}deg);">
            <div class="compass__content content">
              <span class="detail__value content_wind-speed">${windSpeed}</span>
              <span class="content_unit">km/h</span>
            </div>
          </div>
        </div>
      </li>
      <li class="box details__wind-gust detail">
        <h4 class="detail__name">
          <div style="background-image: url(./assets/svg/wind-gust-icon.svg)"></div>
          wind gust
        </h4>
        <p class="detail__value">${wingGust} m/s</p>
      </li>
      <li class="box details__cloudness detail">
        <h4 class="detail__name">
          <div style="background-image: url(./assets/svg/cloud-icon.svg)"></div>
          cloudness
        </h4>
        <p class="detail__value">${cloudiness}%</p>
        <!-- <p class="detail__comment"></p> -->
      </li>
      <li class="box details__feels-like detail">
        <h4 class="detail__name">
          <div style="background-image: url(./assets/svg/temperature-icon.svg)"></div>
          feels like
        </h4>
        <p class="detail__value">${feelsLike}&deg;</p>
        <p class="detail__comment"></p>
      </li>
      <li class="box details__humidity detail">
        <h4 class="detail__name">
          <div style="background-image: url(./assets/svg/humidity-icon.svg)"></div>
          humidity
        </h4>
        <p class="detail__value">${humidity}%</p>
        <p class="detail__comment"></p>
      </li>
      <li class="box details__visibility detail">
        <h4 class="detail__name">
          <div style="background-image: url(./assets/svg/eye-icon.svg)"></div>
          visibility
        </h4>
        <p class="detail__value">${visibility}m</p>
        <p class="detail__comment">The maximum value of the visibility is 10km.</p>
      </li>
      <li class="box details__pressure detail">
        <h4 class="detail__name">
          <div style="background-image: url(./assets/svg/pressure-icon.svg)"></div>
          pressure
        </h4>
        <p class="detail__value">${pressure} hPa</p>
        <p class="detail__comment"></p>
      </li>
    `;
    container.append(wrapper);
  }
 
  displayCurrentInfoBlock({ cityName, dateTime, description, temp, minTemp, maxTemp }) {
    const container = this._$(SELECTORS.CONTAINER);

    const wrapper = document.createElement("div");
    wrapper.classList.add("current-weather", "current", "box");

    wrapper.innerHTML = `
      <h2 class="current__city">
        <div></div>  
      ${cityName}
      </h2>
      <div class="current__date">${dateTime}</div>
      <div class="current__temp">${temp}&deg;</div>
      <div class="current__weather-description">${description}</div>
      <div class="current__temp-range temp-range">
        <div class="temp-range__max">
          <span>MIN</span>
          <span>${minTemp}&deg;</span>
        </div>
        <div class="temp-range__min">
          <span>MAX</span>
          <span>${maxTemp}&deg;</span>
        </div>
      </div>
      </div>
    `;
    container.append(wrapper);
  }

  displayMessageBox(message) {
    const wrapper = this._$(SELECTORS.ERROR_MSG_BOX);
    wrapper.innerHTML = `
      <div class="error__icon-wrapper">
        <img src="./assets/svg/error-icon.svg" alt="Error icon">
      </div>
      <div class="error__msg">${message}</div>
    `;
  } 

  clearContent() {
    this._$(SELECTORS.CONTAINER).innerHTML = '';
  }
} 
