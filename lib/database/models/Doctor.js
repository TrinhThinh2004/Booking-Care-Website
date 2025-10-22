const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define(
    "Doctor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      specialtyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "specialties",
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
      position: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      introduction: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      training: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      achievements: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
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
      tableName: "doctors",
      timestamps: true,
      paranoid: true, // Soft delete
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["specialtyId"],
        },
        {
          fields: ["clinicId"],
        },
        {
          fields: ["isActive"],
        },
      ],
    }
  );

  return Doctor;
};
