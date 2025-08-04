'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('projects', 'currency', {
        allowNull: false,
        type: Sequelize.ENUM('JPY', 'USD', 'VND'),
      }),
      queryInterface.addColumn('projects', 'billable', {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: true,
        after: 'externalPrice',
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('projects', 'currency'),
      queryInterface.removeColumn('projects', 'billable'),
    ]);
  },
};
