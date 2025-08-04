'use strict';

const lines = '`lines`';
const positions = '`positions`';
const collation = '`utf8mb4_unicode_ci`';
const name = '`name`';
const description = '`description`';
const code = '`code`';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query(
        `ALTER TABLE ${lines} CHANGE ${name} ${name} TEXT COLLATE ${collation} ;`
        ),
      queryInterface.sequelize.query(
        `ALTER TABLE ${lines} CHANGE ${description} ${description} TEXT COLLATE ${collation} ;`
        ),
      queryInterface.sequelize.query(
        `ALTER TABLE ${positions} CHANGE ${name} ${name} TEXT COLLATE ${collation} ;`
        ),
      queryInterface.sequelize.query(
        `ALTER TABLE ${positions} CHANGE ${code} ${code} TEXT COLLATE ${collation} ;`
        ),
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
