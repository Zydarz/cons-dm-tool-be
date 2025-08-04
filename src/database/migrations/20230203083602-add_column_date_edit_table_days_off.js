'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('day-offs', 'edit', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'idSame'
      }),
      queryInterface.addColumn('resources','checkDayoff', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'note'
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('day-offs', 'edit'),
      queryInterface.removeColumn('resources', 'checkDayoff'),
    ])
  }
};

