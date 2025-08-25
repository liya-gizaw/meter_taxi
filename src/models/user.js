import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: { len: [3, 20] },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    social_provider: {
      type: DataTypes.ENUM('google', 'facebook', 'apple', 'none'),
      allowNull: false,
      defaultValue: 'none',
    },
    role: {
      type: DataTypes.ENUM('passenger', 'driver', 'dispatcher', 'admin', 'finance'),
      allowNull: false,
      defaultValue: 'passenger',
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    availability: {
      type: DataTypes.ENUM('online', 'offline'),
      allowNull: false,
      defaultValue: 'offline',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['phone'], name: 'users_phone_unique' },
      { unique: true, fields: ['email'], name: 'users_email_unique' },
    ],
  }
);

