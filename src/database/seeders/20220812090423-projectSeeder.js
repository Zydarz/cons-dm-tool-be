'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    await sequelize.transaction(async (transaction) => {
      const options = { transaction };
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options);
      await sequelize.query('TRUNCATE TABLE projects', options);
      await sequelize.query('SET FOREIGN_KEY_CHECKS=1', options);
    });
    const today = new Date();
    return queryInterface.bulkInsert('projects', [
        {
            name: 'ADS',
            code: 'ADS',
            type: 'Fixed',
            startDate: '2022/1/1',
            endDate: '2022/10/14',
            currency: 'VND',
            status: 'Running',
            createdAt: today,
            updatedAt: today
        },
        {
            name: 'YDC',
            code: 'YDC',
            type: 'Labo',
            startDate: '2021/7/12',
            endDate: '2022/12/31',
            currency: 'VND',
            status: 'Running',
            createdAt: today,
            updatedAt: today
        },
        {
            name: 'Jber',
            code: 'JBER',
            type: 'Fixed',
            startDate: '2021/7/12',
            endDate: '2022/12/31',
            currency: 'VND',
            status: 'Running',
            createdAt: today,
            updatedAt: today
        },
        {
            name: 'Global2me',
            code: 'G2M',
            type: 'Labo',
            startDate: '2022/8/22',
            endDate: '2022/10/21',
            currency: 'VND',
            status: 'Running',
            createdAt: today,
            updatedAt: today
        },
        {
            name: 'ACMS - Accounting',
            code: 'ACMSACC',
            type: 'Fixed',
            startDate: '2022/9/5',
            endDate: '2022/12/31',
            currency: 'JPY',
            status: 'Running',
            createdAt: today,
            updatedAt: today
        },
        {
            name: 'DM Tool',
            code: 'DMTOOL',
            type: 'Labo',
            startDate: '2022/8/1',
            endDate: '2022/12/31',
            currency: 'VND',
            status: 'Running',
            createdAt: today,
            updatedAt: today
        },
        {
            name: 'Automation Framework',
            code: 'AUMTFRW',
            type: 'Fixed',
            startDate: '2022/9/5',
            endDate: '2022/12/31',
            currency: 'JPY',
            status: 'Running',
            createdAt: today,
            updatedAt: today
        },
        {
            name: 'Choice Store',
            code: 'CHOICESTORE',
            type: 'Fixed',
            startDate: '2022/7/25',
            endDate: '2022/10/31',
            currency: 'VND',
            status: 'Running',
            createdAt: today,
            updatedAt: today
        },
        {
            name: 'Nobushi Wishuu',
            code: 'NBSWSH',
            type: 'Fixed',
            startDate: '2022/10/3',
            endDate: '2023/3/31',
            currency: 'JPY',
            status: 'Running',
            createdAt: today,
            updatedAt: today
        },
        {
            name: 'Fanzou P2',
            code: 'FNZP2',
            type: 'Fixed',
            startDate: '2022/10/10',
            endDate: '2022/12/27',
            currency: 'USD',
            status: 'Running',
            createdAt: today,
            updatedAt: today
        },
        {
            name: 'ProFutre SurveyHR',
            code: 'PFSHR',
            type: 'Fixed',
            startDate: '2022/10/17',
            endDate: '2022/12/16',
            currency: 'JPY',
            status: 'Open',
            createdAt: today,
            updatedAt: today
        },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('projects', null, {});
  },
};
