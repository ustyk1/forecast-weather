const SELECTORS = {
  TODAY_WEATHER: '.today-weather',
  WEATHER_FOR_FIVE_DAYS: '.five-days-weather',
  DETAILS: '.details',
  CURRENT: '.current-weather',
  ERROR_MSG_BOX: '.error-msg-box',
  CONTAINER: '.container'
}

const ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Location determination not allowed!',
  POSITION_UNAVAILABLE: 'No location information available.',
  TIMEOUT: 'The browser timed out to determine the location!',
  UNKNOWN_ERROR: 'An error occurred determining the location!',
  NOT_FOUND: 'No location found!',
  EMPTY: 'Please, enter the location!'
}
const APP_ID = 'd1ee208e0ada3446742390d1cb841572'
const DEFAULT_CITY = 'Kyiv';

export {
  SELECTORS,
  ERROR_MESSAGES,
  APP_ID,
  DEFAULT_CITY
}