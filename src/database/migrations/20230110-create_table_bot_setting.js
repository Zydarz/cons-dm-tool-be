'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.createTable(
          'bot_setting',
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.BIGINT,
            },
            projectName: {
              allowNull: false,
              type: Sequelize.STRING,
            },

            projectId: {
              allowNull: false,
              type: Sequelize.INTEGER,
            },

            channelId: {
              allowNull: false,
              type: Sequelize.STRING,
            },

            groupId: {
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
            paranoid: true,
          },
        ),
      ]).then(function () {});
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('bot_setting');
  },
};
