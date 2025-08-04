'use strict';

const customers = '`customers`';
const collation = '`utf8mb4_unicode_ci`';
const name = '`name`'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('customers', 'firstContactDate', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      }),
      queryInterface.addColumn('customers', 'contactPoint', {
        allowNull: true,
        type: Sequelize.TEXT,
      }),
      queryInterface.addColumn('customers', 'status', {
        allowNull: false,
        type: Sequelize.ENUM('Active', 'Inactive'),
        default: 'Active',
      }),
      queryInterface.addColumn('customers', 'contactInfo', {
        allowNull: true,
        type: Sequelize.TEXT,
      }),
      queryInterface.sequelize.query(
        `ALTER TABLE ${customers} CHANGE ${name} ${name} TEXT COLLATE ${collation} ;`
        ),
      queryInterface.changeColumn('customers', 'email', {
          allowNull: true,
          type: Sequelize.STRING,
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('customers', 'firstContactDate');
    queryInterface.removeColumn('customers', 'contactPoint');
    queryInterface.removeColumn('customers', 'contactInfo');
    queryInterface.removeColumn('customers', 'status');
  },
};
