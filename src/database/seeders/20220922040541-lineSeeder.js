'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    await sequelize.transaction(async (transaction) => {
      const options = { transaction };
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options);
      await sequelize.query('TRUNCATE TABLE `dm-tool`.lines', options);
      await sequelize.query('SET FOREIGN_KEY_CHECKS=1', options);
    });
    const today = new Date();
    return queryInterface.bulkInsert('lines', [
      {
        createdAt: today,
        updatedAt: today,
        name: 'BUD',
        description: 'BUD',
        flag_protected : 1,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'Vice BUD',
        description: 'Vice BUD',
        flag_protected : 1,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'GL',
        description: 'GL',
        flag_protected : 1,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'PM',
        description: 'Project Manager',
        flag_protected : 0,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'CRM',
        description: 'Customer Relationship Manager',
        flag_protected : 0,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'Com&Brse',
        description: 'Comtor and Bridge Software Engineer',
        flag_protected : 0,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'Tech - FE',
        description: 'Technical Front-End',
        flag_protected : 0,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'Tech - BE',
        description: 'Technical Back-End',
        flag_protected : 0,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'Tech - Mobile',
        description: 'Technical Mobile',
        flag_protected : 0,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'Tech - DevOps',
        description: 'Technical DevOps',
        flag_protected : 0,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'QC',
        description: 'Quality Control',
        flag_protected : 0,
      },
      {
        createdAt: today,
        updatedAt: today,
        name: 'BA',
        description: 'Business Analyst',
        flag_protected : 0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('lines', null, {});
  },
};
