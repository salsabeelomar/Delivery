'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    pickup_lat: DataTypes.NUMBER,
    pickup_lng: DataTypes.NUMBER,
    dropoff_lat: DataTypes.NUMBER,
    dropoff_lng: DataTypes.NUMBER
  }, {});
  Address.associate = function(models) {
    // associations can be defined here
  };
  return Address;
};