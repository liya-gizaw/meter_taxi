import { Permission, RolePermission } from '../models/associations.js';

export const permissionService = {
  async createPermission({ key, description }) {
    return Permission.create({ key, description });
  },

  async listPermissions() {
    return Permission.findAll();
  },

  async grantPermissionToRole(role, permissionKey) {
    const perm = await Permission.findOne({ where: { key: permissionKey } });
    if (!perm) throw new Error('Permission not defined');
    return RolePermission.findOrCreate({ where: { role, permission_id: perm.id } });
  },

  async revokePermissionFromRole(role, permissionKey) {
    const perm = await Permission.findOne({ where: { key: permissionKey } });
    if (!perm) return 0;
    return RolePermission.destroy({ where: { role, permission_id: perm.id } });
  },

  async listRolePermissions(role) {
    const links = await RolePermission.findAll({ where: { role } });
    // Map permission_ids to keys
    const permissionKeys = [];
    for (const link of links) {
      const perm = await Permission.findByPk(link.permission_id);
      if (perm) permissionKeys.push(perm.key);
    }
    return permissionKeys;
  },
};
