'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('projects', 'budget', {
        allowNull: true,
        type: Sequelize.DOUBLE(8, 2),
        after: 'externalPrice',
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('projects', 'budget'),
    ]);
  },
};
