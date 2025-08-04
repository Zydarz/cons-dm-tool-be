'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'projects',
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.BIGINT,
            },

            customerId: {
              allowNull: true,
              type: Sequelize.BIGINT,
            },

            name: {
              allowNull: false,
              type: Sequelize.STRING,
            },

            code: {
              allowNull: false,
              type: Sequelize.STRING,
            },

            type: {
              allowNull: false,
              type: Sequelize.ENUM('Labo', 'Fixed'),
            },

            startDate: {
              allowNull: false,
              type: Sequelize.DATE,
            },

            endDate: {
              allowNull: false,
              type: Sequelize.DATE,
            },

            status: {
              allowNull: true,
              type: Sequelize.ENUM('Bidding', 'Open', 'Running', 'Closed'),
            },
            internalPrice: {
              allowNull: true,
              type: Sequelize.DOUBLE(8, 2),
            },

            externalPrice: {
              allowNull: true,
              type: Sequelize.DOUBLE(8, 2),
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
              allowNull: true,
              type: Sequelize.DATE,
            },
          },
          {
            paranoid: true,
          },
        ),
      ]).then(function () {});
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('projects');
  },
};
