'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('project_situations', 'date', {
        type: Sequelize.DATEONLY,
        after: 'note',
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('project_situations', 'date'),
    ]);
  },
};
