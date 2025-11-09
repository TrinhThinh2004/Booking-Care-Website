const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define(
    "Doctor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      specialtyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "specialties",
          key: "id",
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      clinicId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "clinics",
          key: "id",
        },
      },
      yearsOfExperience: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      introduction: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
