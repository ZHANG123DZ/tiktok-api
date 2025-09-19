'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const roles = [
      {
        name: 'Administrator',
        code: 'admin',
        description: 'Toàn quyền quản lý hệ thống',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        name: 'Moderator',
        code: 'moderator',
        description: 'Quản lý nội dung, có quyền duyệt và chỉnh sửa',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        name: 'User',
        code: 'user',
        description: 'Người dùng thông thường',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        name: 'Guest',
        code: 'guest',
        description: 'Khách vãng lai, chỉ được truy cập công khai',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ];

    await queryInterface.bulkInsert('roles', roles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
