'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('positions', 'flag_protected', {
        type: Sequelize.TINYINT,
        allowNull: false,
        default: 0,
        after: 'code'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('positions', 'flag_protected'),
    ])
  }
};
