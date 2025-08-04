'use strict';
const logworks = '`log_works`';
const taskId = '`taskId`';
const collation = '`utf8mb4_unicode_ci`';
const note = '`note`'
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
        queryInterface.sequelize.query(
            `ALTER TABLE ${logworks} CHANGE ${taskId} ${taskId} VARCHAR(100) DEFAULT NULL COLLATE ${collation} ;`
          ),
          queryInterface.sequelize.query(
            `ALTER TABLE ${logworks} CHANGE ${note} ${note} TEXT DEFAULT NULL COLLATE ${collation} ;`
          )
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('log_works', 'note');
  },
};
