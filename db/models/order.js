'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    name: DataTypes.STRING,
    prefdescription: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.ENUM,
    price: DataTypes.NUMBER
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};