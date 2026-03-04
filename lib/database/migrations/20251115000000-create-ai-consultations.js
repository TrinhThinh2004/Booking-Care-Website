"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ai_consultations", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            symptoms: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            aiResponse: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            suggestedSpecialty: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            urgencyLevel: {
                type: Sequelize.ENUM("low", "medium", "high"),
                allowNull: true,
                defaultValue: "low",
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        await queryInterface.addIndex("ai_consultations", ["userId"]);
        await queryInterface.addIndex("ai_consultations", ["urgencyLevel"]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("ai_consultations");
    },
};
