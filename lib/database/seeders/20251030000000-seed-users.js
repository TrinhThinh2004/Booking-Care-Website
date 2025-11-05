"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const adminPassword = process.env.ADMIN_PASSWORD ;
    const doctorPassword = process.env.DOCTOR_PASSWORD ;
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
          password: bcrypt.hashSync(doctorPassword, 10),
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
         {
        email: "phamchilanh@gmail.com",
        password: bcrypt.hashSync(doctorPassword, 10),
        firstName: "Phạm",
        lastName: "Chí Lăng",
        role: "DOCTOR",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        email: "kieudinhhung@gmail.com",
        password: bcrypt.hashSync(doctorPassword, 10),
        firstName: "Kiều",
        lastName: "Đình Hưng",
        role: "DOCTOR",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        email: "lehonganh@gmail.com",
        password: bcrypt.hashSync(doctorPassword, 10),
        firstName: "Lê",
        lastName: "Hồng Anh",
        role: "DOCTOR",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
       {
        email: "havanquyet@gmail.com",
        password: bcrypt.hashSync(doctorPassword, 10),
        firstName: "Hà Văn",
        lastName: "Quyết",
        role: "DOCTOR",
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
