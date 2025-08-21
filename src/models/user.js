import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
      validate: { len: [3, 20] },
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
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
    language: {
      type: DataTypes.ENUM('am', 'en', 'om', 'ti', 'af'),
      allowNull: false,
      defaultValue: 'en',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
  }
);