'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('other_cost', 'date', {
        allowNull: true,
        type: Sequelize.DATE,
        after: 'note'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('other_cost', 'date')
    ])
  }
};
