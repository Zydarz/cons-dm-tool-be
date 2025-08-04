'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(function handleTransaction(t) {
            return Promise.all([
                queryInterface.createTable(
                    'log_works',
                    {
                        id: {
                            allowNull: false,
                            primaryKey: true,
                            autoIncrement: true,
                            type: Sequelize.BIGINT,
                        },
                        userProjectId: {
                            allowNull: false,
                            type: Sequelize.BIGINT,
                        },
                        reportDate: {
                            allowNull: true,
                            type: Sequelize.DATE,
                        },
                        activity: {
                            allowNull: true,
                            type: Sequelize.ENUM('Management', 'Trans & Comm', 'Investigate', 'DevOps', 'Coding', 'Test', 'Review CD', 'Review TC', 'Report', 'Other')
                        },
                        taskId: {
                            allowNull: true,
                            type: Sequelize.STRING
                        },
                        actualEffort: {
                            allowNull: true,
                            type: Sequelize.INTEGER
                        },
                        note: {
                            allowNull: true,
                            type: Sequelize.STRING
                        },
                        createdAt: {
                            allowNull: false,
                            type: Sequelize.DATE,
                        },
                        updatedAt: {
                            allowNull: false,
                            type: Sequelize.DATE,
                        },
                        deletedAt: {
                            allowNull: true,
                            type: Sequelize.DATE,
                        },
                    },
                    {
                        paranoid: true,
                    },
                ),
            ]).then(function () { });
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('log_works');
    },
};
