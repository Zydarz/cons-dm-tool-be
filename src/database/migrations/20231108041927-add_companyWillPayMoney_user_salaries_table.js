'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('user_salaries', 'companyWillPayMoney', {
        type: Sequelize.BIGINT,
        allowNull: true,
        after: 'socialInsuranceSalary'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('user_salaries', 'companyWillPayMoney')
    ])
  }
};
