// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=bc6a9ceb597185d2cfceed6b968a466f
// lat and lon will be dynamically created and updated variables
// exclude is an optional paramter to exclude specific data
const apiKey = "bc6a9ceb597185d2cfceed6b968a466f";

function kelvinToF (kelvin) {
    var degreesF = ((kelvin - 273.15) * (9/5) + 32);
    return degreesF;
}

function mpsToMph (mps) {
    var mph = mps * 2.237;
    return mph;
}

function getCityWeather (city) {
    
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // console.log(data);
                var temp = (Math.round(kelvinToF(data.main.temp)));
                var wind = (Math.round(mpsToMph(data.wind.speed)));
                var hum = ((data.main.humidity));
                writeToPage(city, temp, wind, hum);
                getUvi(data.coord.lat, data.coord.lon);
            })
        } else {
            console.log("Error reaching open weather API");
        }
    });

}

function getUvi (lat, lon) {

    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                console.log(data.current.uvi);
                writeUvi(data.current.uvi);
        })
        } else {
            console.log("error");
        }
    });
}

function writeToPage (city, temp, wind, hum) {
    $("#city-name").text(city);
    $("#temp").text(`Temp: ${temp}F`);
    $("#wind").text(`Wind: ${wind}mph`);
    $("#hum").text(`Humidity: ${hum}%`);
}

function writeUvi (uvi) {
    $("#uvi").append("UV Index: ");
    $("#uvi-status").append(uvi);

    if (uvi < 5) {
        $("#uvi-status").addClass("badge-success");
    } else if (uvi > 5 && uvi < 10) {
        $("#uvi-status").addClass("badge-warning");
    } else if (uvi >= 10) {
        $("#uvi-status").addClass("badge-danger");
    }
}

$("#search-city").on("submit", function (event) {
    event.preventDefault();

    var city = $("#city").val();
    getCityWeather(city);

});