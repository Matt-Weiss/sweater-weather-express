'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserFavorites = sequelize.define('UserFavorites', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    favorite_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Favorite',
        key: 'id'
      }
    }
  });
  UserFavorites.associate = function(models) {
    // associations can be defined here
  };
  return UserFavorites;
};
