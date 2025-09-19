'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Lấy danh sách role
    const roles = await queryInterface.sequelize.query(
      `SELECT id, code FROM roles`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Lấy danh sách permission
    const permissions = await queryInterface.sequelize.query(
      `SELECT id, code FROM permissions`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!roles.length || !permissions.length) {
      throw new Error('❌ Chưa có role hoặc permission nào để gán');
    }

    const rolePermissions = [];

    for (const role of roles) {
      if (role.code === 'admin') {
        // Admin có tất cả quyền
        for (const perm of permissions) {
          rolePermissions.push({
            role_id: role.id,
            permission_id: perm.id,
            created_at: now,
            updated_at: now,
          });
        }
      } else if (role.code === 'user') {
        // User có quyền cơ bản
        const allowed = ['post.view', 'post.create', 'user.view'];
        for (const perm of permissions) {
          if (allowed.includes(perm.code)) {
            rolePermissions.push({
              role_id: role.id,
              permission_id: perm.id,
              created_at: now,
              updated_at: now,
            });
          }
        }
      }
    }

    await queryInterface.bulkInsert('role_permissions', rolePermissions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};
