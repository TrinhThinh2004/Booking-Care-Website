"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "users",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        firstName: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        gender: {
          type: Sequelize.ENUM("MALE", "FEMALE", "OTHER"),
          allowNull: true,
        },
        role: {
          type: Sequelize.ENUM("ADMIN", "DOCTOR", "PATIENT"),
          allowNull: false,
          defaultValue: "PATIENT",
        },
        avatar: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
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
    // Drop enums first (some DBs require explicit enum removal)
    await queryInterface.dropTable("users");
    try {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_users_gender"'
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_users_role"'
      );
    } catch (e) {
      // Not all dialects support DROP TYPE - ignore
    }
  },
};
