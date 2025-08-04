'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('resource_summaries', 'committed',{
        allowNull: false,
        type: Sequelize.DOUBLE(6, 2),
        default: 0
      }),
      queryInterface.changeColumn('resource_summaries', 'allocated',{
        allowNull: false,
        type: Sequelize.DOUBLE(8, 4),
        default: 0
      }),
      queryInterface.changeColumn('resource_summaries', 'temporaryAdded',{
        allowNull: false,
        type: Sequelize.DOUBLE(8, 4),
        default: 0
      }),
      queryInterface.changeColumn('resource_summaries', 'actual',{
        allowNull: false,
        type: Sequelize.DOUBLE(8, 4),
        default: 0
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('resource_summaries', 'committed',{
        allowNull: false,
        type: Sequelize.DOUBLE(8, 2),
        default: 0
      }),
      queryInterface.changeColumn('resource_summaries', 'allocated',{
        allowNull: false,
        type: Sequelize.DOUBLE(8, 2),
        default: 0
      }),
      queryInterface.changeColumn('resource_summaries', 'temporaryAdded',{
        allowNull: false,
        type: Sequelize.DOUBLE(8, 2),
        default: 0
      }),
      queryInterface.changeColumn('resource_summaries', 'actual',{
        allowNull: false,
        type: Sequelize.DOUBLE(8, 2),
        default: 0
      }),
    ]);
  },
};
