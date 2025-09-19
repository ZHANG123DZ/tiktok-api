'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const permissions = [
      // User management
      {
        name: 'View Users',
        code: 'user.view',
        description: 'Xem danh sách và chi tiết người dùng',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        name: 'Create User',
        code: 'user.create',
        description: 'Tạo mới người dùng',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        name: 'Update User',
        code: 'user.update',
        description: 'Chỉnh sửa thông tin người dùng',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        name: 'Delete User',
        code: 'user.delete',
        description: 'Xóa người dùng',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },

      // Post management
      {
        name: 'View Posts',
        code: 'post.view',
        description: 'Xem danh sách và chi tiết bài viết',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        name: 'Create Post',
        code: 'post.create',
        description: 'Tạo mới bài viết',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        name: 'Update Post',
        code: 'post.update',
        description: 'Chỉnh sửa bài viết',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        name: 'Delete Post',
        code: 'post.delete',
        description: 'Xóa bài viết',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },

      // Role & Permission management
      {
        name: 'Manage Roles',
        code: 'role.manage',
        description: 'Quản lý vai trò (tạo, sửa, xóa)',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      {
        name: 'Manage Permissions',
        code: 'permission.manage',
        description: 'Quản lý quyền hạn trong hệ thống',
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ];

    await queryInterface.bulkInsert('permissions', permissions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
