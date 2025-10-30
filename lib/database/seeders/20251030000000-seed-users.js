"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const adminPassword = process.env.ADMIN_PASSWORD ;
    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin@gmail.com",
          password: bcrypt.hashSync(adminPassword, 10),
          firstName: "Admin",
          lastName: "",
          role: "ADMIN",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          email: "doctor@gmail.com",
          password: bcrypt.hashSync("doctor123", 10),
          firstName: "Hung",
          lastName: "BacSi",
          role: "DOCTOR",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          email: "patient@gmail.com",
          password: bcrypt.hashSync("patient123", 10),
          firstName: "Lan",
          lastName: "BenhNhan",
          role: "PATIENT",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      "users",
      {
        email: [
          "admin@example.com",
          "doctor@example.com",
          "patient@example.com",
        ],
      },
      {}
    );
  },
};
