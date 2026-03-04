const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const AiConsultation = sequelize.define(
        "AiConsultation",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            symptoms: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            aiResponse: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            suggestedSpecialty: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            urgencyLevel: {
                type: DataTypes.ENUM("low", "medium", "high"),
                allowNull: true,
                defaultValue: "low",
            },
        },
        {
            tableName: "ai_consultations",
            timestamps: true,
            indexes: [
                { fields: ["userId"] },
                { fields: ["urgencyLevel"] },
            ],
        }
    );

    return AiConsultation;
};
