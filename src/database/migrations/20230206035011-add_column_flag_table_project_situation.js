'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('project_situations', 'flag', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'date'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('project_situations', 'flag'),
    ])
  }
};

