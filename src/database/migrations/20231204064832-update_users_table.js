'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('users', 'employeeId', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        after: 'idGoogle'
      }),
      queryInterface.addColumn('users', 'bankAccountHolder', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
        after: 'bankName'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'employeeId');
    queryInterface.removeColumn('users', 'bankAccountHolder');
  }
};
