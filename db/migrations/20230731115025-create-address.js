'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'addresses',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          pickup_lat: {
            type: Sequelize.NUMBER,
            allowNull: false,
          },
          pickup_lng: {
            type: Sequelize.NUMBER,
            allowNull: false,
          },
          dropoff_lat: {
            type: Sequelize.NUMBER,
            allowNull: false,
          },
          dropoff_lng: {
            type: Sequelize.NUMBER,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedBy: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
          },
          deletedBy: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
          },
        },
        { transaction: t },
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('addresses', { transaction: t });
    });
  },
};
