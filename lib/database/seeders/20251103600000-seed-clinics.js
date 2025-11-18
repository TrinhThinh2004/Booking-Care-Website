"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "clinics",
      [
        {
          name: "Bệnh viện An Việt",
          address: "18/879 Lạc Thành, Đống Đa, Hà Nội",
          phone: "024 6273 8532",
          image: "/images/Clinic/anviet.png",
          operatingHours: "24/7",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Bệnh viện Nhi Trung ương",
          address: "18 Ngõ 879 La Thành, Láng Thượng, Đống Đa, Hà Nội",
          phone: "024 3754 5346",
          image: "/images/Clinic/anduc.png",
          operatingHours: "24/7",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Bệnh viện Bạch Mai",
          address: "78 Đường Giải Phóng, Phương Mai, Đống Đa, Hà Nội",
          phone: "024 3576 9435",
          image: "/images/Clinic/anviet.png",
          operatingHours: "24/7",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("clinics", null, {});
  },
};
