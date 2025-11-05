"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "doctors",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        image: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        specialtyId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "specialties",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        clinicId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "clinics",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        introduction: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
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
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("doctors");
  },
};
