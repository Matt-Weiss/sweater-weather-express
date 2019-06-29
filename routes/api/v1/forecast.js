var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
var request = require('request');

var api_call = request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
    if (err) {
      return err;
    }
    res = [res.statusCode,body]
    return res
    })


router.get("/", function(req, res, next){
  if(api_call["responseContent"]["statusCode"] == 200){
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(api_call["responseContent"]["body"], null, ' '));
  }
  res.setHeader("Content-Type", "application/json");
  res.status(404).send(JSON.stringify({"Error": "No response from API"}, null, ' '))
});

module.exports = router;
