const apiKey = "066eac4caf7b914446a3c2088682a1bb"; // API key OpenWeatherMap
const cities = ["Nigeria", "Tokyo", "Seoul", "Taiwan", "San paolo", "Abuja"]; // Array cities

function createWidget(cityIndex) {
  const widgetContainer = document.getElementById("widget-container");

  const widget = document.createElement("div");
  widget.className = "weather-widget";
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
  widgetContainer.appendChild(widget);
}

function updateClock(cityIndex, timezoneOffset) {
  const now = new Date();
  const localTime = new Date(now.getTime() + timezoneOffset * 1000);
  const hours = String(localTime.getUTCHours()).padStart(2, "0");
  const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(localTime.getUTCSeconds()).padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;
  document.getElementById(`time-city${cityIndex}`).textContent = timeString;
}

function updateWeather(cityIndex) {
  const city = cities[cityIndex];
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weather = {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].main),
        timezoneOffset: data.timezone // Ottieni l'offset del fuso orario dall'API
      };

      document.getElementById(`location-city${cityIndex}`).textContent =
        weather.location;
      document.getElementById(
        `temperature-city${cityIndex}`
      ).textContent = `${weather.temperature}°C`;
      document.getElementById(`condition-city${cityIndex}`).textContent =
        weather.condition;
      document.getElementById(
        `weather-icon-city${cityIndex}`
      ).className = `weather-icon ${weather.icon}`;

      setInterval(() => {
        updateClock(cityIndex, weather.timezoneOffset);
      }, 1000);
    })
    .catch((error) => {
      console.error("Errore durante il recupero dei dati meteo:", error);
    });
}

function getWeatherIcon(condition) {
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

function initializeWidgets() {
  cities.forEach((_, index) => {
    createWidget(index);
  });

  cities.forEach((_, index) => {
    updateWeather(index);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeWidgets();
});
