'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('projects', 'pm', {
        type: Sequelize.TEXT,
        allowNull: true,
        after: 'code',
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('projects', 'pm');
  },
};
