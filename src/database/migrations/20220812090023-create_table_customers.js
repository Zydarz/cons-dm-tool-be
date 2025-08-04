'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'customers',
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.BIGINT,
            },
            name: {
              allowNull: false,
              type: Sequelize.STRING,
            },

            email: {
              allowNull: false,
              type: Sequelize.STRING,
            },

            phone: {
              allowNull: true,
              type: Sequelize.STRING,
            },

            note: {
              allowNull: true,
              type: Sequelize.TEXT,
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
    return queryInterface.dropTable('customers');
  },
};
