'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('projects', 'contractTypeId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'type'
      }),
      queryInterface.addColumn('log_works','dailyReportActivitiesId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'activity'
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('projects', 'contractTypeId'),
      queryInterface.removeColumn('log_works','dailyReportActivitiesId')
    ])
  }
};
