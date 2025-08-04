'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeIndex('users', 'bankId'),
    queryInterface.removeIndex('user_salaries', 'bankId'),
    queryInterface.changeColumn('user_salaries', 'bankId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    }),
    queryInterface.changeColumn('users', 'bankId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    }),
    queryInterface.addColumn('user_salaries', 'status', {
      allowNull: false,
      type: Sequelize.ENUM('Active', 'Inactive', 'Deleted'),
      default: 'Active',
      after: 'bankName',
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('user_salaries', 'status');
    queryInterface.removeColumn('user_salaries', 'bankId');
    queryInterface.removeColumn('users', 'bankId');
  }
};
