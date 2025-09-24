import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Organization } from './Organization.js';

export const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  organization_id: { type: DataTypes.BIGINT, references: { model: Organization, key: 'id' }, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: true }, // invited users can have null
  full_name: { type: DataTypes.STRING, allowNull: true },
  role: { 
    type: DataTypes.ENUM('org_admin','hr','manager','recruiter','job_seeker'), 
    allowNull: false 
  },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  invite_token: { type: DataTypes.STRING(128), allowNull: true }, // token for invite
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',
  timestamps: false
});

Organization.hasMany(User, { foreignKey: 'organization_id' });
User.belongsTo(Organization, { foreignKey: 'organization_id' });
