'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      await queryInterface.changeColumn('bot_setting', 'channelId', {
        allowNull: true,
        type: Sequelize.STRING
      }),
      await queryInterface.changeColumn('bot_setting', 'groupId', {
        allowNull: true,
        type: Sequelize.STRING
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      await queryInterface.changeColumn('bot_setting', 'channelId', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      await queryInterface.changeColumn('bot_setting', 'groupId', {
        type: Sequelize.STRING,
        allowNull: false,
      })
    ])
  }
};
