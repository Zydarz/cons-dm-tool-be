'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'project_situation_histories',
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.BIGINT,
            },

            projectSituationId: {
              allowNull: false,
              type: Sequelize.BIGINT,
            },

            submitterId: {
              allowNull: false,
              type: Sequelize.STRING,
            },

            projectId: {
              allowNull: false,
              type: Sequelize.BIGINT,
            },

            note: {
              allowNull: true,
              type: Sequelize.TEXT,
            },

            date: {
              allowNull: true,
              type: Sequelize.DATEONLY,
            },

            flag: {
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('project_situation_histories');
  }
};
