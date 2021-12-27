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
var today = new Date();
today = today.toLocaleDateString("en-US");

// function to convert Kelvin to fahrenheit
function kelvinToF (kelvin) {
    var degreesF = ((kelvin - 273.15) * (9/5) + 32);
    return degreesF;
}

// function to convert meters per second to miles per hour
function mpsToMph (mps) {
    var mph = mps * 2.237;
    return mph;
}

function getCityWeather (city) {
    
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // temp variable using temp from API converted to Fahrenheit
                var temp = (Math.round(kelvinToF(data.main.temp)));
                // wind variable using wind speed from API converted to MPH
                var wind = (Math.round(mpsToMph(data.wind.speed)));
                var hum = ((data.main.humidity));
                // pass city name, temp, wind, and humidity to writeToPage function
                writeToPage(city, temp, wind, hum);
                // pass lat and lon coordinates to getUvi function
                getUvi(data.coord.lat, data.coord.lon);
            })
        } else {
            console.log("Error reaching open weather API");
        }
    });

}

function getUvi (lat, lon) {
    // one call URL using lat and lon pulled from previous API call
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // pass uvi from the object to writeUvi function
                writeUvi(data.current.uvi);
        })
        } else {
            console.log("error");
        }
    });
}

// function to update page elements with city name, temp, wind speed, and humidity
function writeToPage (city, temp, wind, hum) {
    // clear all previous information
    $(".current").empty();
    // dynamically update information to page
    $("#city-name").text(city);
    $("#date").append(today);
    $("#temp").append(`Temp: ${temp}<span>&#8457;</span>`);
    $("#wind").text(`Wind: ${wind}mph`);
    $("#hum").text(`Humidity: ${hum}%`);
}

function writeUvi (uvi) {
    //update UV index badge with current UV index
    $("#uvi").text("UV Index: ");
    //create a span with id uvi-status and badge class for UVI
    var span = $("<span></span>")
        .attr("id", "uvi-status")
        .addClass("badge")
        .text(uvi);
    $("#uvi").append(span);

    // check for UV index number and apply color based on safety
    if (uvi < 5) {
        $("#uvi-status").addClass("badge badge-success");
    } else if (uvi > 5 && uvi < 10) {
        $("#uvi-status").addClass("badge badge-warning");
    } else if (uvi >= 10) {
        $("#uvi-status").addClass("badge badge-danger");
    }
}
// target search button in the <form> section
$("#search-city").on("submit", function (event) {
    event.preventDefault();
    // grab value from the input field
    var city = $("#city").val();
    // pass value from input to getCityWeather function
    getCityWeather(city);

});