const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define(
    "Schedule",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "doctors",
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
      maxBooking: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      currentBooking: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "schedules",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          fields: ["doctorId"],
        },
        {
          fields: ["date"],
        },
        {
          fields: ["isActive"],
        },
        {
          unique: true,
          fields: ["doctorId", "date", "timeSlot"],
        },
      ],
    }
  );

  return Schedule;
};
