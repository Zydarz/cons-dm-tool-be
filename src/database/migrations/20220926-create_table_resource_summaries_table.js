'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'resource_summaries',
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.BIGINT,
            },
            projectId: {
              allowNull: false,
              type: Sequelize.BIGINT,
            },

            committerId: {
              allowNull: true,
              type: Sequelize.STRING,
            },

            year: {
              allowNull: false,
              type: Sequelize.INTEGER(4),
            },

            month: {
              allowNull: false,
              type: Sequelize.INTEGER(2),
            },

            committed: {
              allowNull: false,
              type: Sequelize.DOUBLE(8, 2),
              default: 0
            },

            allocated: {
              allowNull: false,
              type: Sequelize.DOUBLE(8, 2),
              default: 0
            },

            temporaryAdded: {
              allowNull: false,
              type: Sequelize.DOUBLE(8, 2),
              default: 0
            },

            actual: {
              allowNull: false,
              type: Sequelize.DOUBLE(8, 2),
              default: 0
            },

            createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
            },

            updatedAt: {
              allowNull: false,
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
    return queryInterface.dropTable('resource_summary');
  },
};
