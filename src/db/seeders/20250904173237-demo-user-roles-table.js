'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Lấy danh sách users
    const users = await queryInterface.sequelize.query(`SELECT id FROM users`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    // Lấy danh sách roles
    const roles = await queryInterface.sequelize.query(
      `SELECT id, code FROM roles`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !roles.length) {
      throw new Error('❌ Chưa có user hoặc role nào để gán');
    }

    const userRoles = [];

    // Tìm role admin
    const adminRole = roles.find((r) => r.code === 'admin');
    const userRole = roles.find((r) => r.code === 'user');

    // User đầu tiên là admin
    if (adminRole) {
      userRoles.push({
        user_id: users[0].id,
        role_id: adminRole.id,
        created_at: now,
        updated_at: now,
      });
    }

    // Các user còn lại random role
    for (let i = 1; i < users.length; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      userRoles.push({
        user_id: users[i].id,
        role_id: role.id,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert('user_roles', userRoles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', null, {});
  },
};
