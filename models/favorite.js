'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    location: DataTypes.STRING
  }, {});
  Favorite.associate = function(models) {
    Favorite.belongsToMany(models.User, {
      through: 'UserFavorites',
      as: 'users',
      foreignKey: 'favorite_id'
    })
  };
  return Favorite;
};
