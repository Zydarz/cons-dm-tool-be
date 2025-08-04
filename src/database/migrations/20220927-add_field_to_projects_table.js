'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('projects', 'startDateActual', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'endDate',
        default: null
      }),
      queryInterface.addColumn('projects', 'endDateActual', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'endDate',
        default: null
      }),
      queryInterface.addColumn('projects', 'currencyId', {
        type: Sequelize.INTEGER,
        after: 'endDate',
        default: 1
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('projects', 'startDateActual'),
      queryInterface.removeColumn('projects', 'endDateActual'),
      queryInterface.removeColumn('projects', 'currencyId'),
    ]);
  },
};
