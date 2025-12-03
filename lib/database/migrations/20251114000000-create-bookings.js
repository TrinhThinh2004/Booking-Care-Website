"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "doctors",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      scheduleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "schedules",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      timeSlot: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    });

    await queryInterface.addIndex("bookings", ["patientId"]);
    await queryInterface.addIndex("bookings", ["doctorId"]);
    await queryInterface.addIndex("bookings", ["clinicId"]);
    await queryInterface.addIndex("bookings", ["scheduleId"]);
    await queryInterface.addIndex("bookings", ["date"]);
    await queryInterface.addIndex("bookings", ["status"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bookings");
  },
};
