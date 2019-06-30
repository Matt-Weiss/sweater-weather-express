var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
var axios = require('axios');

var get_location = function(location){
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&address=${location}`)
  .then(response => {
    return response.data.results[0].geometry.location;
  })
  .catch(error => {
    return error;
  });
}

var get_weather = function(location){
  return axios.get(`https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${location}`)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    return error;
  });
}

var parseWeather = function(location,forecast){
  var current_forecast = forecast["currently"]
  var hourly_header = forecast["hourly"]
  var todays_forecast = forecast["daily"]["data"][0]
  var hourly_forecast = forecast["hourly"]["data"]
  var daily_forecast = forecast["daily"]["data"]

  var parsed_current_forecast = { location: location,
    currently: {
      time: current_forecast["time"],
      glance_summary: current_forecast["summary"],
      icon: current_forecast["icon"],
      current_temperature: current_forecast["temperature"],
      feels_like_temp: current_forecast["apparentTemperature"],
      humidity: current_forecast["humidity"],
      visibility: current_forecast["visibility"],
      uv_index: current_forecast["uvIndex"],
      high_temp: todays_forecast["temperatureHigh"],
      low_temp: todays_forecast["temperatureLow"],
      today_summary: hourly_header["summary"]
    },
    hourly: [{
      time: hourly_forecast[0]["time"],
      icon: hourly_forecast[0]["icon"],
      temp: hourly_forecast[0]["temperature"]
      },
      {
      time: hourly_forecast[2]["time"],
      icon: hourly_forecast[2]["icon"],
      temp: hourly_forecast[2]["temperature"]
      },
      {
      time: hourly_forecast[4]["time"],
      icon: hourly_forecast[4]["icon"],
      temp: hourly_forecast[4]["temperature"]
      },
      {
      time: hourly_forecast[6]["time"],
      icon: hourly_forecast[6]["icon"],
      temp: hourly_forecast[6]["temperature"]
      },
      {
      time: hourly_forecast[8]["time"],
      icon: hourly_forecast[8]["icon"],
      temp: hourly_forecast[8]["temperature"]
      },
      {
      time: hourly_forecast[10]["time"],
      icon: hourly_forecast[10]["icon"],
      temp: hourly_forecast[10]["temperature"]
      },
      {
      time: hourly_forecast[12]["time"],
      icon: hourly_forecast[12]["icon"],
      temp: hourly_forecast[12]["temperature"]
      },
      {
      time: hourly_forecast[14]["time"],
      icon: hourly_forecast[14]["icon"],
      temp: hourly_forecast[14]["temperature"]
    }],
    daily: [{
      day: daily_forecast[1]["time"],
      icon: daily_forecast[1]["icon"],
      summary: daily_forecast[1]["summary"],
      precipitation_chance: daily_forecast[1]["precipProbability"] * 100,
      high_temp: daily_forecast[1]["temperatureHigh"],
      low_temp: daily_forecast[1]["temperatureLow"]
      },
      {
      day: daily_forecast[2]["time"],
      icon: daily_forecast[2]["icon"],
      summary: daily_forecast[2]["summary"],
      precipitation_chance: daily_forecast[2]["precipProbability"] * 100,
      high_temp: daily_forecast[2]["temperatureHigh"],
      low_temp: daily_forecast[2]["temperatureLow"]
      },
      {
      day: daily_forecast[3]["time"],
      icon: daily_forecast[3]["icon"],
      summary: daily_forecast[3]["summary"],
      precipitation_chance: daily_forecast[3]["precipProbability"] * 100,
      high_temp: daily_forecast[3]["temperatureHigh"],
      low_temp: daily_forecast[3]["temperatureLow"]
      },
      {
      day: daily_forecast[4]["time"],
      icon: daily_forecast[4]["icon"],
      summary: daily_forecast[4]["summary"],
      precipitation_chance: daily_forecast[4]["precipProbability"] * 100,
      high_temp: daily_forecast[4]["temperatureHigh"],
      low_temp: daily_forecast[4]["temperatureLow"]
      },
      {
      day: daily_forecast[5]["time"],
      icon: daily_forecast[5]["icon"],
      summary: daily_forecast[5]["summary"],
      precipitation_chance: daily_forecast[5]["precipProbability"] * 100,
      high_temp: daily_forecast[5]["temperatureHigh"],
      low_temp: daily_forecast[5]["temperatureLow"]
      },
      {
      day: daily_forecast[6]["time"],
      icon: daily_forecast[6]["icon"],
      summary: daily_forecast[6]["summary"],
      precipitation_chance: daily_forecast[6]["precipProbability"] * 100,
      high_temp: daily_forecast[6]["temperatureHigh"],
      low_temp: daily_forecast[6]["temperatureLow"]
      },
      {
      day: daily_forecast[7]["time"],
      icon: daily_forecast[7]["icon"],
      summary: daily_forecast[7]["summary"],
      precipitation_chance: daily_forecast[7]["precipProbability"] * 100,
      high_temp: daily_forecast[7]["temperatureHigh"],
      low_temp: daily_forecast[7]["temperatureLow"]
    }],
  }

return parsed_current_forecast;
}

var verifyApiKey = function(api_key){
  return User.findOne({where: {api_key: api_key}})
  .then(user => {
    if(user != null){
      return true;
    }
    return false;
  })
};


router.get("/", function(req, res, next){
  if (req.body.api_key){
    verifyApiKey(req.body.api_key)
    .then((validity) => {
      if (validity == false) {
        res.setHeader("Content-Type", "application/json");
        res.status(401).send("No user with that key!")
      } else {
        get_location(req.query.location)
        .then(location => {
          var parsed_location = `${location["lat"]},${location["lng"]}`
          return get_weather(parsed_location)
          .then(weather => {
            final_forecast = parseWeather(req.query.location, weather)
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(JSON.stringify(final_forecast));
          })
          .catch(error => {
            return error;
          });
        })
      }
    })
  } else {
    res.setHeader("Content-Type", "application/json");
    res.status(401).send(JSON.stringify("No API key sent"));
  }
})


module.exports = router;
