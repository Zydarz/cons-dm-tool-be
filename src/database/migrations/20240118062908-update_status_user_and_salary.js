'use strict';
const users = '`users`';
const user_salaries = '`user_salaries`';
const type = '`type`';
const status = '`status`';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.sequelize.query(
        `UPDATE ${users} SET ${type} = NULL WHERE ${type} IN ('FullTime', 'Temporary', 'Probation');`
        ),
      queryInterface.sequelize.query(
        `UPDATE ${user_salaries} SET ${type} = NULL WHERE ${type} IN ('FullTime', 'Temporary', 'Probation');`
        ),
    ]);
    await Promise.all([
      queryInterface.changeColumn('users', 'type', {
        type: Sequelize.ENUM('FullTimeC', 'FullTimeT', 'PartTime', 'Intern'),
        allowNull: true,
        after: 'status'
      }),
      queryInterface.changeColumn('user_salaries', 'type', {
        type: Sequelize.ENUM('FullTimeC', 'FullTimeT', 'PartTime', 'Intern'),
        allowNull: true,
        after: 'status'
      }),
    ]);
    await Promise.all([
      queryInterface.sequelize.query(
        `UPDATE ${users} SET ${type} = 'FullTimeC' WHERE ${status} = 'Active' and ${type} is NULL;`
        ),
      queryInterface.sequelize.query(
        `UPDATE ${user_salaries} SET ${type} = 'FullTimeC' WHERE ${status} = 'Active' and ${type} is NULL;`
        ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.sequelize.query(
        `UPDATE ${users} SET ${type} = NULL WHERE ${type} IN ('FullTimeC', 'FullTimeT');`
        ),
      queryInterface.sequelize.query(
        `UPDATE ${user_salaries} SET ${type} = NULL WHERE ${type} IN ('FullTimeC', 'FullTimeT');`
        ),
    ]);
    await Promise.all([
      queryInterface.changeColumn('users', 'type', {
        type: Sequelize.ENUM('FullTime', 'PartTime', 'Intern', 'Probation', 'Temporary'),
        allowNull: true,
        after: 'status'
      }),
      queryInterface.changeColumn('user_salaries', 'type', {
        type: Sequelize.ENUM('FullTime', 'PartTime', 'Intern', 'Probation', 'Temporary'),
        allowNull: true,
        after: 'status'
      })
    ]);
    await Promise.all([
      queryInterface.sequelize.query(
        `UPDATE ${users} SET ${type} = 'FullTime' WHERE ${status} = 'Active' and ${type} is NULL;`
        ),
      queryInterface.sequelize.query(
        `UPDATE ${user_salaries} SET ${type} = 'FullTime' WHERE ${status} = 'Active' and ${type} is NULL;`
        ),
    ]);
  }
};
