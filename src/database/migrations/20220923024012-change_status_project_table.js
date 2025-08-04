'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('projects', 'status', {
        allowNull: false,
        type: Sequelize.ENUM('Bidding', 'Open', 'Running', 'Closed', 'Closing'),
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('project', 'status', {
        allowNull: true,
        type: Sequelize.ENUM('Bidding', 'Open', 'Running', 'Closed'),
      }),
    ]);
  },
};
