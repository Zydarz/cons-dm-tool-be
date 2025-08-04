'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('payment_trackings', 'amountVND', {
        allowNull: true,
        type: Sequelize.BIGINT,
        after: 'amount',
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('payment_trackings', 'amountVND');
  }
};
