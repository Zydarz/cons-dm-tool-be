'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('users', 'salaryDefault', {
        type: Sequelize.DOUBLE(17, 2),
        allowNull: false,
        default: 0,
        after: 'username'
      }),
      queryInterface.addColumn('users', 'flagOnsite', {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        default: 0,
        after: 'salaryDefault'
      }),
      queryInterface.addColumn('users', 'note', {
        type: Sequelize.TEXT,
        allowNull: true,
        after: 'flagOnsite'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('users', 'salaryDefault'),
      queryInterface.removeColumn('users', 'flagOnsite'),
      queryInterface.removeColumn('users', 'note'),
    ])
  }
};
