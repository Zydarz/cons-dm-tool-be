'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'user_salaries',
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.BIGINT,
            },

            userId: {
              allowNull: false,
              type: Sequelize.STRING,
            },

            salary: {
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

            date: {
              allowNull: false,
              type: Sequelize.DATE
            },

            flag_protected: {
              type: Sequelize.TINYINT(1),
              allowNull: false,
              default: 0,
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
    await queryInterface.dropTable('user_salaries');
  }
};
