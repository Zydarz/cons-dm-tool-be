'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('payment_trackings', 'status',{
        allowNull: false,
        type: Sequelize.ENUM('New', 'Pending', 'Paid', 'Cancelled', 'Processing'),
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('payment_trackings', 'status',{
        allowNull: false,
        type: Sequelize.ENUM('Pending', 'Paid', 'Cancelled', 'Processing'),
      }),
    ]);
  }
};
