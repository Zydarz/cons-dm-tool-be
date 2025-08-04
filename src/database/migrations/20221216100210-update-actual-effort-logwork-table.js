'use strict';

const { DOUBLE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('log_works', 'actualEffort', {
        allowNull: true,
        type: Sequelize.DOUBLE(4, 2),
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
        queryInterface.removeColumn('log_works', 'actualEffort')
    ]);
  },
};
