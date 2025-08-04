'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('payment_trackings', 'date',{
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        type: Sequelize.DATE,
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('payment_trackings', 'date',{
        allowNull: false,
        type: Sequelize.DATE,
      }),
    ]);
  }
};
