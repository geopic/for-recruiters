$(document).ready(function() {
  $(document).foundation();

  $('form').on('submit', function(e) {
    e.preventDefault();

    $.ajax({
      url: 'https://api.openweathermap.org/data/2.5/forecast',
      data: {
        q: $('#city-input').val(),
        APPID: '2ee8b797967566459f0a37dcd5db6a86'
      },
      type: 'GET',
      dataType: 'json'
    })
      .done(function(json) {
        console.log(json);
      })
      .fail(function(xhr, status, err) {
        console.log('Error!', xhr, status, err);
      });
  });
});
