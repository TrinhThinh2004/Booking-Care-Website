"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("specialties", [
      {
        name: "Tim mạch",
        description: "Chuyên điều trị các bệnh về tim và mạch máu",
        image: "/images/specialty/timmach.png",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Thần kinh",
        description: "Chuyên điều trị các bệnh về não và hệ thần kinh",
        image: "/images/specialty/thankinh.png",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Mắt",
        description: "Chuyên điều trị các bệnh về mắt và thị lực",
        image: "/images/specialty/mat.png",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Xương khớp",
        description: "Chuyên điều trị các bệnh về xương và khớp",
        image: "/images/specialty/coxuongkhop.png",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Nhi khoa",
        description: "Chuyên điều trị các bệnh ở trẻ em",
        image: "/images/specialty/nhikhoa.png",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Hô hấp",
        description: "Chuyên điều trị các bệnh về phổi và đường hô hấp",
        image: "/images/specialty/hohap.png",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name:"Châm cứu",
        description: "Chuyên về phương pháp châm cứu truyền thống",
        image: "/images/specialty/chamcuu.png",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Cột sống",
        description: "Chuyên điều trị các bệnh về cột sống và đau lưng",
        image: "/images/specialty/cotsong.png",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }
      
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("specialties", null, {});
  },
};
