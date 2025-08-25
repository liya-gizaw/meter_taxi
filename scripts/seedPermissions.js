import 'dotenv/config';
import { sequelize } from '../src/models/index.js';
import { Permission, RolePermission } from '../src/models/associations.js';

async function ensurePermission(key, description) {
  const [perm] = await Permission.findOrCreate({
    where: { key },
    defaults: { key, description }
  });
  return perm;
}

async function ensureGrant(role, permissionId) {
  await RolePermission.findOrCreate({
    where: { role, permission_id: permissionId },
    defaults: { role, permission_id: permissionId }
  });
}

async function seed() {
  try {
    await sequelize.authenticate();

    const permissionSpecs = [
      // Generic document upload for end-users
      { key: 'documents.upload', description: 'Allow uploading documents' },
      // Admin document review
      { key: 'admin.documents.review', description: 'Review user documents' },
      // Admin user management
      { key: 'admin.users.list', description: 'List users' },
      { key: 'admin.users.get', description: 'Get user details' },
      { key: 'admin.users.create', description: 'Create users' },
      { key: 'admin.users.update', description: 'Update users' },
      { key: 'admin.users.delete', description: 'Delete users' },
      // Admin profile management
      { key: 'admin.profiles.list', description: 'List profiles' },
      { key: 'admin.profiles.get', description: 'Get profile details' },
      { key: 'admin.profiles.create', description: 'Create profiles' },
      { key: 'admin.profiles.update', description: 'Update profiles' },
      { key: 'admin.profiles.delete', description: 'Delete profiles' },
      // Permission management
      { key: 'permissions.create', description: 'Create permissions' },
      { key: 'permissions.list', description: 'List permissions' },
      { key: 'permissions.grant', description: 'Grant permissions to roles' },
      { key: 'permissions.revoke', description: 'Revoke permissions from roles' },
      { key: 'permissions.listRole', description: 'List role permissions' },
    ];

    const keyToPerm = {};
    for (const spec of permissionSpecs) {
      const perm = await ensurePermission(spec.key, spec.description);
      keyToPerm[spec.key] = perm;
    }

    // Grants
    const grants = [
      // documents.upload should be available to drivers and passengers (and admins optionally)
      { role: 'driver', key: 'documents.upload' },
      { role: 'passenger', key: 'documents.upload' },
      { role: 'admin', key: 'documents.upload' },

      // Admin-only permissions
      { role: 'admin', key: 'admin.documents.review' },

      { role: 'admin', key: 'admin.users.list' },
      { role: 'admin', key: 'admin.users.get' },
      { role: 'admin', key: 'admin.users.create' },
      { role: 'admin', key: 'admin.users.update' },
      { role: 'admin', key: 'admin.users.delete' },

      { role: 'admin', key: 'admin.profiles.list' },
      { role: 'admin', key: 'admin.profiles.get' },
      { role: 'admin', key: 'admin.profiles.create' },
      { role: 'admin', key: 'admin.profiles.update' },
      { role: 'admin', key: 'admin.profiles.delete' },

      { role: 'admin', key: 'permissions.create' },
      { role: 'admin', key: 'permissions.list' },
      { role: 'admin', key: 'permissions.grant' },
      { role: 'admin', key: 'permissions.revoke' },
      { role: 'admin', key: 'permissions.listRole' },
    ];

    for (const { role, key } of grants) {
      const perm = keyToPerm[key];
      if (!perm) continue;
      await ensureGrant(role, perm.id);
    }

    console.log('✅ Permission seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Permission seeding failed:', err);
    process.exit(1);
  }
}

seed();
