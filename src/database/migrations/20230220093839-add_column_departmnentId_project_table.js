'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('projects', 'departmentId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'contractTypeId'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('projects', 'departmentId'),
    ])
  }
};