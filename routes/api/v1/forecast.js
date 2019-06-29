var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
var request = require('request');

var api_call = request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
    if (err) {
      return err;
    }else{
      return [res.statusCode,body]
    }
    })


router.get("/", function(req, res, next){
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(api_call["responseContent"]["body"], null, ' '));
});

module.exports = router;
