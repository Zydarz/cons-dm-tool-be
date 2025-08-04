'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'setting_other_cost',
          {
            id: {
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              type: Sequelize.BIGINT,
            },
            name: {
              allowNull: true,
              type: Sequelize.STRING,
            },
            order: {
              allowNull: true,
              type: Sequelize.DOUBLE(8, 4),
              default: 1,
            },
            flag_protected: {
              type: Sequelize.TINYINT(1),
              allowNull: false,
              defaultValue: 0,
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
    await queryInterface.dropTable('setting_other_cost');
  }
};
