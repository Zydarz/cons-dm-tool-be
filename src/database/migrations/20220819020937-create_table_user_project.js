'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'user_projects',
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.BIGINT,
            },
            userId: {
              allowNull: false,
              type: Sequelize.BIGINT,
            },
            projectId: {
              allowNull: false,
              type: Sequelize.BIGINT,
            },
            positionId: {
              allowNull: true,
              type: Sequelize.BIGINT,
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
    return queryInterface.dropTable('project_users');
  },
};
