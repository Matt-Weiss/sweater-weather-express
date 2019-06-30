var express = require("express");
var router = express.Router();
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

module.exports = router;
