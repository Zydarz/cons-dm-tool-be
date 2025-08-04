'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('resources', 'positionId', {
        allowNull: false,
        type: Sequelize.BIGINT,
        after: 'userProjectId',
      }),
      queryInterface.removeColumn('user_projects', 'positionId'),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('resources', 'positionId'),
      queryInterface.addColumn('user_projects', 'positionId', {
        type: Sequelize.BIGINT,
        after: 'projectId',
      }),
    ]);
  },
};
