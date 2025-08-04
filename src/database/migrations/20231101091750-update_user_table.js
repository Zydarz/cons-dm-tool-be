'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('users', 'bankId', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        after: 'surName'
      }),
      queryInterface.addColumn('users', 'bankName', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'bankId'
      }),
      queryInterface.addColumn('users', 'type', {
        type: Sequelize.ENUM('FullTime', 'PartTime', 'OnSite'),
        allowNull: true,
        after: 'bankName'
      }),
      queryInterface.addColumn('users', 'dependent', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'type'
      }),
      queryInterface.addColumn('users', 'socialInsuranceSalary', {
        type: Sequelize.BIGINT,
        allowNull: true,
        after: 'dependent'
      }),
      queryInterface.addColumn('users', 'paymentType', {
        type: Sequelize.ENUM('CK', 'TM'),
        allowNull: true,
        after: 'socialInsuranceSalary'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('users', 'bankId'),
      queryInterface.removeColumn('users', 'bankName'),
      queryInterface.removeColumn('users', 'type'),
      queryInterface.removeColumn('users', 'dependent'),
      queryInterface.removeColumn('users', 'socialInsuranceSalary'),
      queryInterface.removeColumn('users', 'paymentType'),
    ])
  }
};
