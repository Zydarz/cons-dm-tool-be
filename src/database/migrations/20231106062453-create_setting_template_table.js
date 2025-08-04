'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'setting_template',
          {
            id: {
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              type: Sequelize.BIGINT,
            },
            title: {
              allowNull: false,
              type: Sequelize.STRING,
            },
            type: {
              allowNull: false,
              type: Sequelize.ENUM('Situation', 'Mail', 'Message', 'Notify'),
              default: 'Situation',
            },
            content: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
            userUpdateId: {
              allowNull: false,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('other_cost');
  }
};
