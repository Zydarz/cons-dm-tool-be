'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('user_salaries', 'bankId', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        after: 'salary'
      }),
      queryInterface.addColumn('user_salaries', 'bankName', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'bankId'
      }),
      queryInterface.addColumn('user_salaries', 'type', {
        type: Sequelize.ENUM('FullTime', 'PartTime', 'OnSite'),
        allowNull: true,
        after: 'bankName'
      }),
      queryInterface.addColumn('user_salaries', 'dependent', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'type'
      }),
      queryInterface.addColumn('user_salaries', 'socialInsuranceSalary', {
        type: Sequelize.BIGINT,
        allowNull: true,
        after: 'dependent'
      }),
      queryInterface.addColumn('user_salaries', 'paymentType', {
        type: Sequelize.ENUM('CK', 'TM'),
        allowNull: true,
        after: 'socialInsuranceSalary'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('user_salaries', 'bankId'),
      queryInterface.removeColumn('user_salaries', 'bankName'),
      queryInterface.removeColumn('user_salaries', 'type'),
      queryInterface.removeColumn('user_salaries', 'dependent'),
      queryInterface.removeColumn('user_salaries', 'socialInsuranceSalary'),
      queryInterface.removeColumn('user_salaries', 'paymentType'),
    ])
  }
};
