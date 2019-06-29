var express = require("express");
var router = express.Router();
var User = require('../../../models').User;

const bcrypt = require('bcrypt');

var checkPassword = function(password, hash){
  return bcrypt.compare(password, hash).then(function(res) {
    return res
  });
}

var verifyLogin = function(email, password){
  return User.findOne({where: {email: email} })
  .then(user => {
  return bcrypt.compare(password, user.password).then(function(res) {
    results = [res,user]
    return results
    })
  });
};

router.post("/", function(request, response, next){
  verifyLogin(request.body.email, request.body.password)
  .then((results) => {
    if(results[0] == true) {
      response.setHeader("Content-Type", "application/json");
      response.status(200).send(JSON.stringify({api_key: results[1].api_key}, null, ' '));
    } else {
      response.setHeader("Content-Type", "application/json");
      response.status(401).send(JSON.stringify("Invalid credentials", null, ' '));
    }
  })
  .catch(error => {
    response.setHeader("Content-Type", "application/json");
    response.status(500).send({ error });
  });
})

module.exports = router;
