'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'day-offs',
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.BIGINT,
            },
            date: {
              allowNull: false,
              type: Sequelize.DATE,
              unique: true
            },
            note: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            idSame: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
            },
            updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
            },
          },
          {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci' 
          }
        ),
      ]).then(function () { });
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('days-off');
  },
};

