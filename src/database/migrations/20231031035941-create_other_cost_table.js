'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'other_cost',
          {
            id: {
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              type: Sequelize.BIGINT,
            },
            settingOtherCostId: {
              type: Sequelize.BIGINT,
              allowNull: false,
            },
            departmentId: {
              type: Sequelize.BIGINT,
              allowNull: false,
            },
            amount: {
              allowNull: false,
              type: Sequelize.DOUBLE,
            },
            year: {
              allowNull: false,
              type: Sequelize.INTEGER(4),
            },
            month: {
              allowNull: false,
              type: Sequelize.INTEGER(2),
            },
            note: {
              type: Sequelize.TEXT,
              allowNull: true,
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
    await queryInterface.dropTable('other_cost');
  }
};
