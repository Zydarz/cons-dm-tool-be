'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('payment_trackings', 'effort',{
        allowNull: false,
         type: Sequelize.DOUBLE(14, 4),
         default: 0
          }),
      queryInterface.changeColumn('payment_trackings', 'amount',{
        allowNull: false,
        type: Sequelize.DOUBLE(17, 2),
        default: 0
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('payment_trackings', 'amount');
  },
};
