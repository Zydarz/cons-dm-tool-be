'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('lines', 'flag_protected', {
        type: Sequelize.TINYINT,
        allowNull: false,
        default: 0,
        after: 'description'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('lines', 'flag_protected'),
    ])
  }
};
