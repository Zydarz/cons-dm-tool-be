'use strict';
const resources = '`resources`';
const collation = '`utf8mb4_unicode_ci`';
const note = '`note`'
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
          queryInterface.sequelize.query(
            `ALTER TABLE ${resources} CHANGE ${note} ${note} TEXT DEFAULT NULL COLLATE ${collation} ;`
          )
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('resources', 'note');
  },
};

