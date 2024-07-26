// Define the API key for OpenWeatherMap
const apiKey = "066eac4caf7b914446a3c2088682a1bb";

// Define an array of city names
const cities = ["Nigeria", "Abuja", "Seoul", "Tokyo", "Taiwan", "San paolo"];

// Function to create a weather widget for a given city index
function createWidget(cityIndex) {
  // Get the container element for the widgets
  const widgetContainer = document.getElementById("widget-container");

  // Create a new div element for the widget
  const widget = document.createElement("div");
  widget.className = "weather-widget";

  // Set the inner HTML of the widget to a template string
  widget.innerHTML = `
    <div class="clock">
      <div id="time-city${cityIndex}"></div>
    </div>
    <div class="weather-info">
      <div class="weather-icon" id="weather-icon-city${cityIndex}"></div>
      <div class="weather-details">
        <h2 id="location-city${cityIndex}">Location</h2>
        <p id="temperature-city${cityIndex}" class="temperature">--°C</p>
        <p id="condition-city${cityIndex}" class="condition">Condition</p>
      </div>
    </div>
  `;

  // Append the widget to the container element
  widgetContainer.appendChild(widget);
}

// Function to update the clock for a given city index and timezone offset
function updateClock(cityIndex, timezoneOffset) {
  // Get the current date and time
  const now = new Date();

  // Calculate the local time for the given timezone offset
  const localTime = new Date(now.getTime() + timezoneOffset * 1000);

  // Format the local time as a string
  const hours = String(localTime.getUTCHours()).padStart(2, "0");
  const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(localTime.getUTCSeconds()).padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;

  // Update the clock element with the formatted time string
  document.getElementById(`time-city${cityIndex}`).textContent = timeString;
}

// Function to update the weather data for a given city index
function updateWeather(cityIndex) {
  // Get the city name for the given index
  const city = cities[cityIndex];

  // Construct the API URL for the weather data
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  // Fetch the weather data from the API
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Extract the relevant weather data from the API response
      const weather = {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].main),
        timezoneOffset: data.timezone
      };

      // Update the weather elements with the extracted data
      document.getElementById(`location-city${cityIndex}`).textContent = weather.location;
      document.getElementById(`temperature-city${cityIndex}`).textContent = `${weather.temperature}°C`;
      document.getElementById(`condition-city${cityIndex}`).textContent = weather.condition;
      document.getElementById(`weather-icon-city${cityIndex}`).className = `weather-icon ${weather.icon}`;

      // Set an interval to update the clock every second
      setInterval(() => {
        updateClock(cityIndex, weather.timezoneOffset);
      }, 1000);
    })
    .catch((error) => {
      // Log any errors that occur during the API request
      console.error("Errore durante il recupero dei dati meteo:", error);
    });
}

// Function to get the weather icon class name for a given condition
function getWeatherIcon(condition) {
  // Use a switch statement to map the condition to an icon class name
  switch (condition) {
    case "Clear":
      return "sunny";
    case "Clouds":
      return "cloudy";
    case "Rain":
      return "rainy";
    case "Snow":
      return "snowy";
    default:
      return "sunny";
  }
}

// Function to initialize the weather widgets
function initializeWidgets() {
  // Create a widget for each city in the cities array
  cities.forEach((_, index) => {
    createWidget(index);
  });

  // Update the weather data for each city
  cities.forEach((_, index) => {
    updateWeather(index);
  });
}

// Add an event listener to the document to initialize the widgets when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeWidgets();
  });



