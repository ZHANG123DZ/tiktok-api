const { User, Role, Permission } = require('@/models');

/**
 * Middleware kiểm tra quyền
 * @param {string[]} requiredPermissions - Danh sách quyền cần có
 */
function authorize(requiredPermissions = []) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          as: 'roles',
          include: {
            model: Permission,
            as: 'permissions',
          },
        },
      });

      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }

      const userPermissions = new Set();
      user.roles.forEach((role) => {
        role.permissions.forEach((perm) => {
          userPermissions.add(perm.code);
        });
      });

      if (requiredPermissions.length === 0) {
        return next();
      }

      const hasPermission = requiredPermissions.some((perm) =>
        userPermissions.has(perm)
      );

      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: 'Bạn không có quyền truy cập tài nguyên này' });
      }

      next();
    } catch (err) {
      console.error('Authorize middleware error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

module.exports = authorize;
