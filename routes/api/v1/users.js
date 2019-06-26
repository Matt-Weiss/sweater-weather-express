var express = require("express");
var router = express.Router();
var User = require('../../../models').User;



router.post("/", function(request, response, next){
  User.create({
    email: request.body.email,
    api_key: "test"
  })
  .then(user => {
    response.setHeader("Content-Type", "application/json");
    response.status(201).send(JSON.stringify(user.api_key));
  })
  .catch(error => {
    response.setHeader("Content-Type", "application/json");
    response.status(500).send({ error });
  });
})

module.exports = router;
