'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('projects', 'type',{
        allowNull: true,
        type: Sequelize.ENUM('Labo', 'Fixed'),
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('projects', 'type');
  },
};