'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('resources', 'userId', {
        allowNull: true,
        type: Sequelize.STRING,
        after: 'userProjectId',
      }),
      queryInterface.addColumn('resources', 'projectId', {
        allowNull: true,
        type: Sequelize.BIGINT,
        after: 'userId',
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('resources', 'userId');
    queryInterface.removeColumn('resources', 'projectId');
  },
};
