'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('users', 'idGoogle', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        after: 'id'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('users', 'idGoogle'),
    ])
  }
};
