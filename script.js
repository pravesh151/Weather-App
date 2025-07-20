const apiKey = "b0fc7a935f526c1eddb0ccb12dd15c29"; // Replace with your own API key if needed

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const result = document.getElementById("weatherResult");
  const anim = document.getElementById("weatherAnimation");

  if (!city) {
    result.innerHTML = "❗ Please enter a city name.";
    anim.innerHTML = "";
    document.body.className = "";
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    const weatherType = data.weather[0].main.toLowerCase();           // e.g., rain
    const weatherDesc = data.weather[0].description.toLowerCase();   // e.g., light rain

    // Remove all previous classes and animation
    document.body.className = "";
    anim.innerHTML = "";

    // Handle main weather conditions
    if (weatherType.includes("cloud")) {
      document.body.classList.add("clouds");
      anim.innerHTML = `
        <div class="cloud"></div>
        <div class="cloud cloud--small"></div>`;

    } else if (weatherDesc.includes("light rain")) {
      document.body.classList.add("rain");
      anim.innerHTML = `
        <div class="rain rain--light"></div>
        <div class="cloud cloud--small"></div>`;

    } else if (weatherDesc.includes("moderate rain")) {
      document.body.classList.add("rain");
      anim.innerHTML = `
        <div class="rain rain--moderate"></div>
        <div class="cloud"></div>`;

    } else if (weatherDesc.includes("heavy rain") || weatherType.includes("thunderstorm")) {
      document.body.classList.add("rain");
      anim.innerHTML = `
        <div class="rain rain--heavy"></div>
        <div class="thunder"></div>
        <div class="cloud"></div>`;

    } else if (weatherType.includes("clear")) {
      document.body.classList.add("clear");
      anim.innerHTML = `<div class="sun"></div>`;

    } else if (weatherType.includes("snow")) {
      document.body.classList.add("clear");
      for (let i = 0; i < 20; i++) {
        const snow = document.createElement('div');
        snow.className = 'snowflake';
        snow.style.left = `${Math.random() * 100}%`;
        snow.style.animationDuration = `${2 + Math.random() * 3}s`;
        snow.style.opacity = Math.random();
        anim.appendChild(snow);
      }

    } else if (weatherDesc.includes("night")) {
      document.body.classList.add("night");
      anim.innerHTML = `<div class="moon"></div>`;
    }

    // OPTIONAL: Time-based Night Mode
    const hour = new Date().getHours();
    if (hour >= 19 || hour <= 5) {
      document.body.classList.add("night");
    }

    // Show weather data
    const weatherInfo = `
      <p><strong>📍 ${data.name}, ${data.sys.country}</strong></p>
      <p>🆔 City ID: ${data.id}</p>
      <p>🌐 Coordinates: [${data.coord.lat}, ${data.coord.lon}]</p>
      <p>🌡️ Temperature: ${data.main.temp} °C</p>
      <p>🌥️ Weather: ${data.weather[0].main} - ${data.weather[0].description}</p>
      <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
    `;
    result.innerHTML = weatherInfo;

  } catch (error) {
    result.innerHTML = `❌ Error: ${error.message}`;
    anim.innerHTML = "";
    document.body.className = "";
  }
}
