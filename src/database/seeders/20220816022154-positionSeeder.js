'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    await sequelize.transaction(async (transaction) => {
      const options = { transaction };
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options);
      await sequelize.query('TRUNCATE TABLE positions', options);
      await sequelize.query('SET FOREIGN_KEY_CHECKS=1', options);
    });
    const today = new Date();
    return queryInterface.bulkInsert('positions', [
        {
            name: "Project Manager",
            code: "PM",
            flag_protected : 1,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Comtor",
            code: "COM",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Business Analytic",
            code: "BA",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Designer",
            code: "DESIGN",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Tester Leader",
            code: "TEST-L",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Test Manual",
            code: "TEST",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
        {
            name: "Test Automatic",
            code: "TEST-A",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Technical Leader",
            code: "TECH-L",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {

            name: "Backend Developer Leader",
            code: "DEV-BE-L",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Backend Developer",
            code: "DEV-BE",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Frontend Developer Leadr",
            code: "DEV-FE-L",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Frontend Developer",
            code: "DEV-FE",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Mobile Developer Leader",
            code: "DEV-M-L",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Mobile Developer",
            code: "DEV-M",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "DevOps Leader",
            code: "DEVOPS-L",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "DevOps",
            code: "DEVOPS",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Team Leader",
            code: "TL",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "BRSE",
            code: "BRSE",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Division Leader",
            code: "DL",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "Sub Division Leader",
            code: "Sub DL",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
          {
            name: "BRSE Leader",
            code: "BRSE-L",
            flag_protected : 0,
            createdAt: today,
            updatedAt: today,
          },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('positions', null, {});
  },
};
