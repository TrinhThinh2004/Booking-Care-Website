const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define(
    "History",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      files: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "histories",
      timestamps: true,
      paranoid: true, // Soft delete
      indexes: [
        {
          fields: ["patientId"],
        },
        {
          fields: ["doctorId"],
        },
      ],
    }
  );

  return History;
};
