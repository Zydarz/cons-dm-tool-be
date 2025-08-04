'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('user_salaries', 'departmentId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'paymentType'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('user_salaries', 'departmentId'),
    ])
  }
};
