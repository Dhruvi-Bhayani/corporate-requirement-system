import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Organization } from './Organization.js';

export const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  organization_id: { 
    type: DataTypes.BIGINT, 
    references: { model: Organization, key: 'id' } 
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM('org_admin','hr','manager','recruiter','job_seeker'), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  invite_token: { type: DataTypes.STRING(128) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',
  timestamps: false
});

Organization.hasMany(User, { foreignKey: 'organization_id' });
User.belongsTo(Organization, { foreignKey: 'organization_id' });
