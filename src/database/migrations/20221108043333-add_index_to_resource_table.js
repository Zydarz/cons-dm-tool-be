'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addIndex('resources', {
        fields: ['userProjectId', 'positionId', 'date', 'acPercent', 'tcPercent', 'createdAt'],
        using: 'BTREE',
        name:'index_resources'
        })
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('resources', 'userProjectId'),
    ]);
  },
};