'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
    },
    password: DataTypes.STRING,
    api_key: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.belongsToMany(models.Favorite, {
      through: 'UserFavorites',
      as: 'favorites',
      foreignKey: 'user_id'
    })
  };
  return User;
};
