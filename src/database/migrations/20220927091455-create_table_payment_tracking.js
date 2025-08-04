'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(function handleTransaction(t) {
            return Promise.all([
                queryInterface.createTable(
                    'payment_trackings',
                    {
                        id: {
                            allowNull: false,
                            primaryKey: true,
                            autoIncrement: true,
                            type: Sequelize.BIGINT,
                        },
                        title: {
                            allowNull: false,
                            type: Sequelize.STRING,
                        },
                        date: {
                            allowNull: false,
                            type: Sequelize.DATE,
                        },
                        effort: {
                            allowNull: false,
                            type: Sequelize.DOUBLE(8, 2)
                        },
                        amount: {
                            allowNull: false,
                            type: Sequelize.INTEGER
                        },
                        paydate: {
                            allowNull: true,
                            type: Sequelize.DATE
                        },
                        status: {
                            allowNull: false,
                            type: Sequelize.ENUM('Pending', 'Paid', 'Cancelled', 'Processing')
                        },
                        note: {
                            allowNull: true,
                            type: Sequelize.TEXT
                        },
                        projectId: {
                            allowNull: false,
                            type: Sequelize.BIGINT
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
        return queryInterface.dropTable('payment_trackings');
    },
};


