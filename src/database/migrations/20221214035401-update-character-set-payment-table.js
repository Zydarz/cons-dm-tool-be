'use strict';
const payment = '`payment_trackings`';
const title = '`title`';
const collation = '`utf8mb4_unicode_ci`';
const note = '`note`'
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
        queryInterface.sequelize.query(
            `ALTER TABLE ${payment} CHANGE ${title} ${title} VARCHAR(100) DEFAULT NULL COLLATE ${collation} ;`
          ),
          queryInterface.sequelize.query(
            `ALTER TABLE ${payment} CHANGE ${note} ${note} TEXT DEFAULT NULL COLLATE ${collation} ;`
          )
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('payment_trackings', 'title');
  },
};
