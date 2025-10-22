const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const AllCode = sequelize.define(
    "AllCode",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      tableName: "allcodes",
      timestamps: true,
      paranoid: true, // Soft delete
      indexes: [
        {
          fields: ["type"],
        },
        {
          unique: true,
          fields: ["type", "key"],
        },
      ],
    }
  );

  return AllCode;
};
