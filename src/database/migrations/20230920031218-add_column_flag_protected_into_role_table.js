'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('role', 'flag_protected', {
        type: Sequelize.TINYINT,
        allowNull: false,
        default: 0,
        after: 'allDivision'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('role', 'flag_protected'),
    ])
  }
};
