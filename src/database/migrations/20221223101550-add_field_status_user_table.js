'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('users', 'status', {
        allowNull: false,
        type: Sequelize.ENUM('Active', 'Inactive', 'Deleted'),
        after: 'role',
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'status');
  },
};

