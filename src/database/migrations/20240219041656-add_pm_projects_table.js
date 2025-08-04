'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('projects', 'am', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
        after: 'pm'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('projects', 'am')
    ])
  }
};
