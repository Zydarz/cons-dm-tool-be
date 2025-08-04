'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('user_projects', 'userId', {
        type: Sequelize.STRING,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('user_projects', 'userId', {
        type: Sequelize.BIGINT,
      }),
    ]);
  },
};
