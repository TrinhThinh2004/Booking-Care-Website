const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "doctors",
          key: "id",
        },
      },
      clinicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "clinics",
          key: "id",
        },
      },
      scheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "schedules",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      timeSlot: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "bookings",
      timestamps: true,
      paranoid: true, // Soft delete
      indexes: [
        {
          fields: ["patientId"],
        },
        {
          fields: ["doctorId"],
        },
        {
          fields: ["clinicId"],
        },
        {
          fields: ["scheduleId"],
        },
        {
          fields: ["date"],
        },
        {
          fields: ["status"],
        },
      ],
    }
  );

  return Booking;
};
