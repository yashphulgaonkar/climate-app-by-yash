// Climate App by Yash
// Fetches weather using Open-Meteo API

const apiBase = "https://api.open-meteo.com/v1/forecast";

document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value.trim();
    if (city) getWeatherByCity(city);
});

document.getElementById("locationBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude, "Your Location");
            },
            () => alert("Location access denied.")
        );
    } else {
        alert("Geolocation not supported by your browser.");
    }
});

async function getWeatherByCity(city) {
    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found!");
            return;
        }
        const { latitude, longitude, name, country } = geoData.results[0];
        fetchWeather(latitude, longitude, `${name}, ${country}`);
    } catch (error) {
        alert("Error fetching city data.");
    }
}

async function fetchWeather(lat, lon, place) {
    try {
        const res = await fetch(`${apiBase}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await res.json();
        displayWeather(data, place);
    } catch (error) {
        alert("Error fetching weather data.");
    }
}

function displayWeather(data, place) {
    const current = data.current_weather;
    document.getElementById("cityName").textContent = place;
    document.getElementById("temperature").textContent = `🌡️ ${current.temperature}°C`;
    document.getElementById("conditions").textContent = `💨 Wind: ${current.windspeed} km/h`;
    document.getElementById("humidity").textContent = `🕒 Time: ${current.time}`;
    document.getElementById("wind").textContent = `🔄 Weather Code: ${current.weathercode}`;

    const forecast = data.daily;
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";
    for (let i = 0; i < forecast.time.length; i++) {
        const div = document.createElement("div");
        div.className = "forecast-day";
        div.innerHTML = `<strong>${forecast.time[i]}</strong><br>Max: ${forecast.temperature_2m_max[i]}°C<br>Min: ${forecast.temperature_2m_min[i]}°C`;
        forecastDiv.appendChild(div);
    }
}
