'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('job_rank', 'order', {
        allowNull: true,
        default: 1,
        type: Sequelize.DOUBLE(8, 4),
        after: 'name',
      }),
      queryInterface.addColumn('daily_report_activities', 'order', {
        allowNull: true,
        type: Sequelize.DOUBLE(8, 4),
        default: 1,
        after: 'name',
      }),
      queryInterface.addColumn('lines', 'order', {
        allowNull: true,
        type: Sequelize.DOUBLE(8, 4),
        default: 1,
        after: 'name',
      }),
      queryInterface.addColumn('positions', 'order', {
        allowNull: true,
        type: Sequelize.DOUBLE(8, 4),
        default: 1,
        after: 'name',
      }),
      queryInterface.addColumn('contract_type', 'order', {
        allowNull: true,
        type: Sequelize.DOUBLE(8, 4),
        default: 1,
        after: 'name',
      }),
      queryInterface.addColumn('project_rank', 'order', {
        allowNull: true,
        type: Sequelize.DOUBLE(8, 4),
        default: 1,
        after: 'name',
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await Promise.all([
      queryInterface.removeColumn('job_rank', 'userId'),
      queryInterface.removeColumn('daily_report_activities', 'projectId'),
      queryInterface.removeColumn('lines', 'userId'),
      queryInterface.removeColumn('positions', 'projectId'),
      queryInterface.removeColumn('contract_type', 'userId'),
      queryInterface.removeColumn('project_rank', 'projectId'),
    ])
  },
};
