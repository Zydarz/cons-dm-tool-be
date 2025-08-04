'use strict';
const project_situations = '`project_situations`';
const collation = '`utf8mb4_unicode_ci`';
const note = '`note`'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      await queryInterface.changeColumn('project_situations', 'note', {
        allowNull: true,
        type: Sequelize.TEXT('medium')
      }),
      await queryInterface.sequelize.query(
        `ALTER TABLE ${project_situations} CHANGE ${note} ${note} MEDIUMTEXT  COLLATE ${collation} ;`
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
        queryInterface.removeColumn('project_situations', 'note'),
    ])
  }
};