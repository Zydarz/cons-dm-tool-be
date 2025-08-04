'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'resources',
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.BIGINT,
            },

            userProjectId: {
              allowNull: false,
              type: Sequelize.BIGINT,
            },
            date: {
              allowNull: false,
              type: Sequelize.DATE,
            },
            acPercent: {
              allowNull: false,
              type: Sequelize.INTEGER,
            },
            tcPercent: {
              allowNull: true,
              type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('resources');
  },
};
