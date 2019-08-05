const displayEl = $('#site-weather-display');

/**
 * @description Form submit event handling starting point.
 * @param {Event} e Form submit event.
 */
export const handleSubmit = e => {
  e.preventDefault();

  // Fetch data
  $.ajax({
    url: 'https://api.openweathermap.org/data/2.5/forecast',
    data: {
      q: $('#city-input').val(),
      units: 'metric',
      APPID: '2ee8b797967566459f0a37dcd5db6a86'
    },
    type: 'GET',
    dataType: 'json'
  })
    .done(handleSubmitSuccess)
    .fail(handleSubmitError)
    .always(handleSubmitAlways);
};

/**
 * @description Handle the successful retrieval of data from the OpenWeather external API.
 * @param {object} json JSON data.
 */
export const handleSubmitSuccess = json => {
  // Clear input field
  $('#city-input').val('');

  // Set up main display
  $.each(json.list, (index, entry) => {
    const box = document.createElement('div');
    box.classList.add('weather-box');

    // Date
    const dtEl = document.createElement('div');
    dtEl.classList.add('weather-box-date');
    dtEl.textContent = moment(entry.dt_txt).format('ddd, hA');
    box.appendChild(dtEl);

    // Emoji icon
    const icEl = document.createElement('div');
    icEl.classList.add('weather-box-icon');
    icEl.textContent = '<insert emoji here>';
    box.appendChild(icEl);

    // Temperature
    const tempEl = document.createElement('div');
    tempEl.classList.add('weather-box-temp');
    tempEl.textContent = `${entry.main.temp.toFixed()}°C`;
    box.appendChild(tempEl);

    // Cloudiness
    const cldEl = document.createElement('div');
    cldEl.classList.add('weather-box-cloudiness');
    cldEl.textContent = `${entry.clouds.all}% cloudy`;
    box.appendChild(cldEl);

    // Wind
    const wndEl = document.createElement('div');
    wndEl.classList.add('weather-box-wind');
    wndEl.textContent = `Wind: ${entry.wind.speed.toFixed()}mph, ${entry.wind.deg.toFixed()}°`;
    box.appendChild(wndEl);

    displayEl.append(box);
  });
};

/**
 * @description Handle any failure in retrieving data from the OpenWeather external API.
 * @param {XMLHttpRequest} xhr XMLHTTPRequest object.
 * @param {string} status Status code of error.
 * @param {string} err Error message.
 */
export const handleSubmitError = (xhr, status, err) => {
  displayEl.text(`Error in fetching weather data: "${err}"`);
};

/**
 * @description The logic which 'always' runs AFTER the form submit event is triggered.
 */
export const handleSubmitAlways = () => {
  // Refocus on input field
  $('#city-input').focus();

  // Make main display visible
  displayEl.removeClass('hide');
};

// Initialise application
$(document).ready(function() {
  $(document).foundation();

  $('form').on('submit', handleSubmit);
});
