import $ from 'jquery';
import {
  handleSubmit,
  handleSubmitSuccess,
  handleSubmitError,
  handleSubmitAlways
} from 'emojiweather/script.js';

beforeEach(() => {
  $('body').html(
    '<input type="text" id="city-input"/><div id="site-weather-display" class="hide"></div>'
  );
});

describe('handleSubmit', () => {
  test('exists', () => {
    expect(handleSubmit).toBeDefined();
  });
});

describe('handleSubmitSuccess', () => {
  const mockData = {
    list: [
      {
        dt_txt: new Date().toString(),
        main: {
          temp: 10
        },
        clouds: {
          all: 10
        },
        wind: {
          speed: 10,
          deg: 10
        }
      }
    ]
  };

  test('clears input field', () => {
    $('#city-input').val('hello world');
    handleSubmitSuccess(mockData);

    expect(($('#city-input').val() as string).length).toBe(0);
  });

  test('adds elements to DOM', () => {
    $('#city-input').val('london');
    handleSubmitSuccess(mockData);

    expect(
      $('body')
        .html()
        .includes('weather-box')
    ).toBe(true);
  });
});

describe('handleSubmitError', () => {
  test('displays error message', () => {
    handleSubmitError();

    expect(
      $('#site-weather-display')
        .text()
        .toLowerCase()
        .includes('error')
    ).toBe(true);
  });
});

describe('handleSubmitAlways', () => {
  test('makes main display visible', () => {
    expect($('#site-weather-display').hasClass('hide')).toBe(true);

    handleSubmitAlways();

    expect($('#site-weather-display').hasClass('hide')).toBe(false);
  });
});
