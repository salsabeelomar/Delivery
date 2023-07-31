'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    role: DataTypes.ENUM,
    password: DataTypes.STRING,
    updatedBy: DataTypes.NUMBER,
    deletedBy: DataTypes.NUMBER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};