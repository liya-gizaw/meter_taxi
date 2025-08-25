import { RolePermission, Permission } from '../models/associations.js';

export function requirePermission(permissionKey) {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const userRole = req.user.role;
      const perm = await Permission.findOne({ where: { key: permissionKey } });
      if (!perm) return res.status(403).json({ message: 'Permission not defined' });
      const link = await RolePermission.findOne({ where: { role: userRole, permission_id: perm.id } });
      if (!link) return res.status(403).json({ message: 'Forbidden' });
      return next();
    } catch (err) {
      return res.status(500).json({ message: 'Permission check failed' });
    }
  };
}
