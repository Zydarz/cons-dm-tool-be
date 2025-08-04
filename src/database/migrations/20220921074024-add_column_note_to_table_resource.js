'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('resources', 'note', {
        type: Sequelize.TEXT,
        allowNull: true,
        after: 'tcPercent',
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('resources', 'note');
  },
};
