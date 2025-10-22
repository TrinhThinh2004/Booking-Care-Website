const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Markdown = sequelize.define(
    "Markdown",
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
      contentHTML: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      contentMarkdown: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "markdowns",
      timestamps: true,
      paranoid: true, // Soft delete
      indexes: [
        {
          fields: ["doctorId"],
        },
      ],
    }
  );

  return Markdown;
};
