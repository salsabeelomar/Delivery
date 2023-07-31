'use strict';
module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    orderId: DataTypes.NUMBER,
    userId: DataTypes.NUMBER,
    updatedBy: DataTypes.NUMBER,
    deletedBy: DataTypes.NUMBER
  }, {});
  Delivery.associate = function(models) {
    // associations can be defined here
  };
  return Delivery;
};