'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'permisson',
          {
            id: {
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              type: Sequelize.BIGINT,
            },
            path: {
              allowNull: true,
              type: Sequelize.STRING,
            },
            method: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            roleId: {
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('permisson');
  }
};
