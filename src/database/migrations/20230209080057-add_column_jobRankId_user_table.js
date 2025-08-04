'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('users', 'jobRankId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'lineId'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('users', 'jobRankId'),
    ])
  }
};

