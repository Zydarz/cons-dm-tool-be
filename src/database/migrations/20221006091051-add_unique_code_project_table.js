'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addIndex('projects', {
        fields: ['code'],
        unique: true,
        })
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('projects', 'code'),
    ]);
  },
};
