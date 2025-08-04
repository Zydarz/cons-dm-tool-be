'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('permisson', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
        after: 'id'
      }),
      queryInterface.addColumn('permisson', 'action', {
        type: Sequelize.ENUM('exc', 'block', 'only', ),
        allowNull: false,
        after: 'method'
        }),
      queryInterface.addColumn('role', 'allDivision', {
        type: Sequelize.ENUM('all', 'division'),
        allowNull: false,
        after: 'name'
        }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('permisson', 'name'),
      queryInterface.removeColumn('permisson', 'action'),
      queryInterface.removeColumn('role', 'allDivision'),
    ])
  }
};
