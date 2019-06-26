var express = require("express");
var router = express.Router();
const uuidv4 = require('uuid/v4');
var User = require('../../../models').User;

const bcrypt = require('bcrypt');
const saltRounds = 10;

var encrypted_password = function(password){
  return bcrypt.hashSync(password, saltRounds);
};

var findUserByEmail = function(email){
  return User.findOne({where: {email: email} })
  .then(user => {
     if(user == null){
       return true;
     }
     return false;
  })
};


router.post("/", function(request, response, next){
  findUserByEmail(request.body.email.toLowerCase())
    .then((validity) => {
      if (validity == false) {
        response.setHeader("Content-Type", "application/json");
        response.status(500).send("This email is already in use!")
      } else if (request.body.password != request.body.confirm_password) {
        response.setHeader("Content-Type", "application/json");
        response.status(500).send("Passwords don't match")
      } else {
        User.create({
          email: request.body.email.toLowerCase(),
          password: encrypted_password(request.body.password),
          api_key: uuidv4()
        })
        .then(user => {
          response.setHeader("Content-Type", "application/json");
          response.status(201).send(JSON.stringify({api_key: user.api_key}, null, ' '));
        })
        .catch(error => {
          response.setHeader("Content-Type", "application/json");
          response.status(500).send({ error });
        });
      }
    });
})

module.exports = router;
