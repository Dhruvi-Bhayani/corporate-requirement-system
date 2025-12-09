import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const Organization = sequelize.define('Organization', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  domain: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'organizations',
  timestamps: false
});
