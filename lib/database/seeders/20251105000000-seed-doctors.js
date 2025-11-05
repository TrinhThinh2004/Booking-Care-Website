"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id,email FROM Users WHERE role = "DOCTOR"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const specialties = await queryInterface.sequelize.query(
      "SELECT id FROM Specialties",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // const clinics = await queryInterface.sequelize.query(
    //   "SELECT id FROM Clinics",
    //   { type: Sequelize.QueryTypes.SELECT }
    // );

     const doctors = [
      {
        userId: users.find(u => u.email === "phamchilanh@gmail.com")?.id,
        specialtyId: specialties[0]?.id || 1,
        image: "/images/doctor/ts-pham-chi-lang.png",
        description:
          "Bác sĩ có 35 năm kinh nghiệm về lĩnh vực Cột sống, thần kinh, cơ xương khớp.",
        price: 500000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: users.find(u => u.email === "kieudinhhung@gmail.com")?.id,
        specialtyId: specialties[0]?.id || 1,
        image: "/images/doctor/kieudinhhung.png",
        description:
          "Bác sĩ có nhiều năm kinh nghiệm trong khám và điều trị Cơ xương khớp.",
        price: 450000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: users.find(u => u.email === "lehonganh@gmail.com")?.id,
        specialtyId: specialties[1]?.id || 2,
        image: "/images/doctor/lehonganh.png",
        description:
          "Chuyên gia Tim mạch với hơn 20 năm kinh nghiệm điều trị các bệnh về tim mạch.",
        price: 600000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: users.find(u => u.email === "havanquyet@gmail.com")?.id,
        specialtyId: specialties[1]?.id || 2,
        image: "/images/doctor/havanquyet.png",
        description:
          "Bác sĩ có nhiều năm kinh nghiệm trong khám và điều trị các bệnh về tim mạch.",
        price: 600000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Doctors", doctors, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Doctors", null, {});
  },
};
