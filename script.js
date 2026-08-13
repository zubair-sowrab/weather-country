const countryInput = document.getElementById("countryInput");
const searchButton = document.getElementById("searchButton");
const countryResult = document.getElementById("countryResult");
const errorMessage = document.getElementById("errorMessage");

const restCountriesKey = "rc_live_69ce35c471f94363bc60468166cbb353";
const weatherApiKey = "1c0c23ae281b9313c29eb9487c63257e";



searchButton.addEventListener("click", searchCountry);

countryInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchCountry();
    }
});

async function searchCountry() {

    const countryName = countryInput.value.trim();

    if (countryName === "") {
        errorMessage.textContent = "Please enter a country name.";
        countryResult.innerHTML = "";
        return;
    }

    errorMessage.textContent = "";
    countryResult.innerHTML = "<p>Loading...</p>";

    try {

        const response = await fetch(
            "https://api.restcountries.com/countries/v5/names.common/" +
            encodeURIComponent(countryName),
            {
                headers: {
                    "Authorization": "Bearer " + restCountriesKey
                }
            }
        );

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const result = await response.json();
        const country = result.data.objects[0];

        displayCountry(country);

    } catch (error) {

        countryResult.innerHTML = "";
        errorMessage.textContent = "Country not found. Please try again.";

        console.log(error);
    }
}

function displayCountry(country) {

    const name = country.names.common;
    const officialName = country.names.official;
    const capital = country.capitals
        ? country.capitals[0].name
        : "Not available";

    const population = country.population.toLocaleString();
    const region = country.region;
    const flag = country.flag.url_svg;

    countryResult.innerHTML = `
        <div class="country-card">

            <div class="country-main">

                <img src="${flag}" class="country-flag" alt="${name} flag">

                <div class="country-details">

                    <h3>${name}</h3>

                    <p>${officialName}</p>

                    <div class="info">

                        <div>
                            <span>Capital</span>
                            <strong>${capital}</strong>
                        </div>

                        <div>
                            <span>Population</span>
                            <strong>${population}</strong>
                        </div>

                        <div>
                            <span>Region</span>
                            <strong>${region}</strong>
                        </div>

                    </div>

                </div>

            </div>

            <button class="details-button" onclick="getWeather('${capital}')">More Details</button>

            <div id="weather" class="weather"></div>

        </div>
    `;
}

async function getWeather(capital) {

    const weather = document.getElementById("weather");

    weather.classList.add("show");

    weather.innerHTML = "<p>Loading weather...</p>";

    try {

        const response = await fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            encodeURIComponent(capital) +
            "&appid=" +
            weatherApiKey +
            "&units=metric"
        );

        if (!response.ok) {
            throw new Error("Weather not found");
        }

        const data = await response.json();

        const temperature = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const humidity = data.main.humidity;
        const condition = data.weather[0].description;

        weather.innerHTML = `
            <h4>Current Weather in ${capital}</h4>

            <div class="weather-info">

                <div class="weather-box">
                    <span>Temperature</span>
                    <strong>${temperature}°C</strong>
                </div>

                <div class="weather-box">
                    <span>Feels Like</span>
                    <strong>${feelsLike}°C</strong>
                </div>

                <div class="weather-box">
                    <span>Condition</span>
                    <strong>${condition}</strong>
                </div>

                <div class="weather-box">
                    <span>Humidity</span>
                    <strong>${humidity}%</strong>
                </div>

            </div>
        `;

    } catch (error) {

        weather.innerHTML = "<p>Weather information is not available.</p>";

        console.log(error);
    }
}