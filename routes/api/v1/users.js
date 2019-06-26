var express = require("express");
var router = express.Router();
var User = require('../../../models').User;

const bcrypt = require('bcrypt');
const saltRounds = 10;

var encrypted_password = function(password){
  return bcrypt.hashSync(password, saltRounds);
}

router.post("/", function(request, response, next){
  User.create({
    email: request.body.email,
    password: encrypted_password(request.body.password),
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
