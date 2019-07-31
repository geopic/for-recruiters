/**
 * Handle submit of location by user, query weather API.
 * @param {Event} e Form submit event.
 */
export const handleSubmit = e => {
  e.preventDefault();

  const displayEl = $('#site-weather-display');

  // Fetch data
  $.ajax({
    url: 'https://api.openweathermap.org/data/2.5/forecast',
    data: {
      q: $('#city-input').val(),
      APPID: '2ee8b797967566459f0a37dcd5db6a86'
    },
    type: 'GET',
    dataType: 'json'
  })
    .done(json => {
      // Clear input field
      $('#city-input').val('');

      // Set up main display
      $.each(json.list, (index, entry) => {
        console.log(`${index}: ${entry}`);
      });
    })
    .fail((xhr, status, err) => {
      displayEl.text(`Error in fetching weather data: "${err}"`);
    })
    .always(() => {
      // Refocus on input field
      $('#city-input').focus();

      // Make main display visible
      displayEl.removeClass('hide');
    });
};

// Initialise application
$(document).ready(function() {
  $(document).foundation();

  $('form').on('submit', handleSubmit);
});
