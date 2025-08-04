'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    await sequelize.transaction(async (transaction) => {
      const options = { transaction };
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options);
      await sequelize.query('TRUNCATE TABLE customers', options);
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options);
    });

    const limit = 10;
    const customers = [...Array(limit)].map((_, i) => {
      return {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        note: faker.lorem.lines(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    return queryInterface.bulkInsert('customers', customers);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('customers', null, {});
  },
};
