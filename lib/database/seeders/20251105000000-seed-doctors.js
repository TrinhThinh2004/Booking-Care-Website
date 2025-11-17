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

    const clinics = await queryInterface.sequelize.query(
      "SELECT id FROM Clinics",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const doctorEntries = [
      {
        image: "doctor.png",
        email: "doctor@gmail.com",
        name: "Le Quoc Viet",
      },
      {
        image: "ts-pham-chi-lang.png",
        email: "ts-pham-chi-lang@gmail.com",
        name: "Phạm Chí Lăng",
      },
      {
        image: "lequocviet.png",
        email: "lequocviet@gmail.com",
        name: "Lê Quốc Việt",
      },
      {
        image: "kieudinhhung.png",
        email: "kieudinhhung@gmail.com",
        name: "Kiều Đình Hưng",
      },
      {
        image: "lehonganh.png",
        email: "lehonganh@gmail.com",
        name: "Lê Hồng Anh",
      },
      {
        image: "havanquyet.png",
        email: "havanquyet@gmail.com",
        name: "Hà Văn Quyết",
      },
      {
        image: "nguyenhuuthao.png",
        email: "nguyenhuuthao@gmail.com",
        name: "Nguyễn Hữu Thảo",
      },
      {
        image: "nguyenthihoaian.png",
        email: "nguyenthihoaian@gmail.com",
        name: "Nguyễn Thị Hoa An",
      },
      {
        image: "nguyentienlang.png",
        email: "nguyentienlang@gmail.com",
        name: "Nguyễn Tiến Lãng",
      },
      {
        image: "nguyentronghung.png",
        email: "nguyentronghung@gmail.com",
        name: "Nguyễn Trọng Hùng",
      },
      {
        image: "nguyenvandoanh.png",
        email: "nguyenvandoanh@gmail.com",
        name: "Nguyễn Văn Doanh",
      },
      {
        image: "nguyenvanquynh.png",
        email: "nguyenvanquynh@gmail.com",
        name: "Nguyễn Văn Quỳnh",
      },
      {
        image: "traanhduy.png",
        email: "traanhduy@gmail.com",
        name: "Trần Anh Duy",
      },
      {
        image: "tranthimaithy.png",
        email: "tranthimaithy@gmail.com",
        name: "Trần Thị Mai Thy",
      },
      {
        image: "vovanman.png",
        email: "vovanman@gmail.com",
        name: "Võ Văn Mẫn",
      },
    ];

    const doctors = doctorEntries.map((entry, idx) => ({
      userId: users.find((u) => u.email === entry.email)?.id,
      specialtyId: specialties[idx % specialties.length]?.id || (idx % 5) + 1,
      clinicId: clinics[idx % clinics.length]?.id || (idx % 3) + 1,
      image: `/images/doctor/${entry.image}`,
      description: `Bác sĩ ${entry.name} — chuyên môn hàng đầu, nhiều kinh nghiệm trong việc khám và điều trị.`,
      yearsOfExperience: 5 + (idx % 20),
      price: 300000 + (idx % 5) * 50000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Doctors", doctors, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Doctors", null, {});
  },
};
