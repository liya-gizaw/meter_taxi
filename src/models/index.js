import { sequelize } from '../config/db.js';
import { DataTypes, Model } from 'sequelize';

// User model
export class User extends Model {}
User.init(
  { id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }, email: DataTypes.STRING },
  { sequelize, tableName: 'users', timestamps: true }
);

// Profile model
export class Profile extends Model {}
Profile.init(
  { id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }, user_id: DataTypes.UUID },
  { sequelize, tableName: 'profiles', timestamps: true }
);

// Permission model
export class Permission extends Model {}
Permission.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(255) },
  },
  { sequelize, tableName: 'permissions', timestamps: true }
);

// RolePermission model
export class RolePermission extends Model {}
RolePermission.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    role: { type: DataTypes.ENUM('passenger','driver','dispatcher','admin','finance'), allowNull: false },
    permission_id: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, tableName: 'role_permissions', timestamps: true }
);

// Associations
User.hasOne(Profile, { foreignKey: 'user_id', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Permission.hasMany(RolePermission, { foreignKey: 'permission_id', as: 'roleLinks' });
RolePermission.belongsTo(Permission, { foreignKey: 'permission_id', as: 'permission' });

// ✅ Only export each class once
export { sequelize};
