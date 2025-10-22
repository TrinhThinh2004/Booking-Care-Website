const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("ADMIN", "DOCTOR", "PATIENT"),
        allowNull: false,
        defaultValue: "PATIENT",
      },
      avatar: {
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
      tableName: "users",
      timestamps: true,
      paranoid: true, // Soft delete
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          fields: ["role"],
        },
        {
          fields: ["isActive"],
        },
      ],
    }
  );

  return User;
};
