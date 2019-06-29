var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
var request = require('request');
var response = null

var api_call = request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
    if (err) {
      return err;
    } else {
      response = [res.statusCode,body]
    }
  })


router.get("/", function(req, res, next){
  if(response[0] == 200){
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(response[1], null, ' '));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.status(404).send(JSON.stringify({"Error": "No response from API"}, null, ' '))
  }
});

module.exports = router;
