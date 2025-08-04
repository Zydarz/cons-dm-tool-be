'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(function handleTransaction(t) {
            return Promise.all([
                queryInterface.createTable(
                    'users',
                    {
                        id: {
                            allowNull: false,
                            primaryKey: true,
                            type: Sequelize.STRING,
                        },
                        lineId: {
                            allowNull: true,
                            type: Sequelize.STRING,
                        },
                        mail: {
                            allowNull: false,
                            type: Sequelize.STRING,
                        },
                        displayName: {
                            allowNull: false,
                            type: Sequelize.STRING,
                        },
                        givenName: {
                            allowNull: true,
                            type: Sequelize.STRING,
                        },
                        surName: {
                            allowNull: true,
                            type: Sequelize.STRING,
                        },
                        role: {
                            allowNull: true,
                            type: Sequelize.ENUM('admin', 'los', 'member'),
                        },
                        username: {
                            allowNull: true,
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
        return queryInterface.dropTable('users');
    },
};
