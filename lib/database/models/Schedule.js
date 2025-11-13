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
      timeSlots: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      tableName: "schedules",
      timestamps: true,
      indexes: [
        {
          fields: ["doctorId"],
        },
        {
          fields: ["date"],
        },
        {
          unique: true,
          fields: ["doctorId", "date"],
        },
      ],
    }
  );

  return Schedule;
};
