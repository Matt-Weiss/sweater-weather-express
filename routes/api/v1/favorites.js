var express = require("express");
var router = express.Router();
var axios = require('axios');
var User = require('../../../models').User;
var Favorite = require('../../../models').Favorite;
var UserFavorites = require('../../../models').UserFavorites;


var verifyApiKey = function(api_key){
  return User.findOne({where: {api_key: api_key}})
  .then(user => {
    if(user != null){
      return [true,user];
    }
    return [false,user];
  })
};

var findOrCreateFavorite = function(location){
  return Favorite.findOrCreate({where: {location: location}})
  .then(favorite => {
    return favorite
  })
}

var findOrCreateUserFavorite = function(user_id, favorite_id){
  return UserFavorites.findOrCreate({where: {
                                      user_id: user_id,
                                      favorite_id: favorite_id}
                                    })
}

var findUserFavorites = function(user_id){
  return User.findOne({where: {id: user_id}})
  .then(user => {
    return user.getFavorites()
    .then(favorites => {
      return favorites
    })
  })
}

var parseWeather = function(location,forecast){
  var current_forecast = forecast["currently"]
  var hourly_header = forecast["hourly"]
  var todays_forecast = forecast["daily"]["data"][0]

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
    }
  }
  return parsed_current_forecast
}

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

var getWeatherArray = function(favorite) {
  var cityState = favorite.location
  return get_location(cityState)
  .then(location => {
    var parsed_location = `${location["lat"]},${location["lng"]}`
    return get_weather(parsed_location)
    .then(weather => {
      weather = parseWeather(cityState, weather)
      return weather
    })
  })
}

router.post("/", function(req, res, next){
  if (req.body.api_key){
    verifyApiKey(req.body.api_key)
    .then((validity) => {
      if (validity[0] == false) {
        res.setHeader("Content-Type", "application/json");
        res.status(401).send("No user with that key!")
      } else {
        var user = validity[1]
        findOrCreateFavorite(req.body.location)
        .then(favorite => {
          findOrCreateUserFavorite(user.id, favorite[0].id)
          res.setHeader("Content-Type", "application/json");
          res.status(201).send(JSON.stringify(`${favorite[0].location} added to your favorites!`))
        })
      }
    })
  }
})

router.get("/", function(req, res, next){
  if (req.body.api_key){
    verifyApiKey(req.body.api_key)
    .then((validity) => {
      if (validity[0] == false) {
        res.setHeader("Content-Type", "application/json");
        res.status(401).send("No user with that key!")
      } else {
        findUserFavorites(validity[1].id)
        .then(favorites =>{
          Promise.all(favorites.map(getWeatherArray))
          .then(location_weather =>{
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(JSON.stringify(location_weather));
          })
          .catch(error => {
            return error;
          });
        })
      }
    })
  }
})

module.exports = router;
