'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    user_id: DataTypes.INTEGER,
    location: DataTypes.STRING
  }, {});
  Favorite.associate = function(models) {
    Favorite.belongToMany(models.User, {
      through: 'UserFavorites',
      as: 'users',
      foreignKey: 'favorite_id'
    })
  };
  return Favorite;
};
