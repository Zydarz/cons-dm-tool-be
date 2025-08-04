'use strict';
const users = '`users`';
const displayName = '`displayName`';
const givenName = '`givenName`';
const mail = '`mail`';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query(
        `ALTER TABLE ${users}
       MODIFY COLUMN ${displayName} varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL AFTER ${mail},
       MODIFY COLUMN ${givenName} varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL AFTER ${displayName};`
        ),
    ]);
  },

  async down (queryInterface, Sequelize) {

  }
};
