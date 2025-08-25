import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

export class UserDocument extends Model {}

UserDocument.init(
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    type: {
      type: DataTypes.ENUM(
        'id_card',
        'driver_license',
        'vehicle_registration',
        'insurance',
        'other'
      ),
      allowNull: false,
    },
    file_path: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
    metadata: { type: DataTypes.JSON, allowNull: true },
    review_note: { type: DataTypes.STRING(255), allowNull: true },
    reviewed_by: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    reviewed_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'user_documents', timestamps: false }
);
