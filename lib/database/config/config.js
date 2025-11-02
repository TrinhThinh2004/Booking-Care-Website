require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "booking_care_dev",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    timezone: "+07:00",
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "booking_care_test",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    timezone: "+07:00",
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    timezone: "+07:00",
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
  },
};
