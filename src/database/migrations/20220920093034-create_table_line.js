'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'lines',
          {
            id: {
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              type: Sequelize.BIGINT,
            },
            name: {
              allowNull: false,
              type: Sequelize.STRING,
            },
            description: {
              allowNull: true,
              type: Sequelize.STRING,
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
    return queryInterface.dropTable('lines');
  },
};
