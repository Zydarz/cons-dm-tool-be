'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('users', 'type', {
      type: Sequelize.ENUM('FullTime', 'PartTime', 'Intern', 'Probation', 'Temporary'),
      allowNull: true,
      after: 'status'
    }),
    queryInterface.changeColumn('user_salaries', 'type', {
      type: Sequelize.ENUM('FullTime', 'PartTime', 'Intern', 'Probation', 'Temporary'),
      allowNull: true,
      after: 'status'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
