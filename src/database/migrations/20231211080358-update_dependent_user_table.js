'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('users', 'dependent'),
      queryInterface.removeColumn('user_salaries', 'dependent')
    ]),
    await Promise.all([
      queryInterface.addColumn('users', 'dependent', {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
        after: 'bankAccountHolder'
      }),
      queryInterface.addColumn('user_salaries', 'dependent', {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
        after: 'type'
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
  }
};
