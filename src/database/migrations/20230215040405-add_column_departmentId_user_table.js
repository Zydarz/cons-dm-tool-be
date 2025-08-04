'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('users', 'departmentId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'jobRankId'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('users', 'departmentId'),
    ])
  }
};
