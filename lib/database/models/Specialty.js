const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Specialty = sequelize.define(
    "Specialty",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "specialties",
      timestamps: true,
      paranoid: true, // Soft delete
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
        {
          fields: ["isActive"],
        },
      ],
    }
  );

  return Specialty;
};
