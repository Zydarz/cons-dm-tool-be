'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.changeColumn('users', 'lineId', {
            type: Sequelize.BIGINT,
            allowNull: true,
        });

    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.removeColumn('users', 'lineId');
    }
};
