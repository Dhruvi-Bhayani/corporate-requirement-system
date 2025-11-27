import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Organization } from './Organization.js';

export const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },

  organization_id: {
    type: DataTypes.BIGINT,
    references: { model: Organization, key: 'id' },
    allowNull: true
  },

  email: { type: DataTypes.STRING, allowNull: false, unique: true },

  password_hash: { type: DataTypes.STRING, allowNull: true },

  full_name: { type: DataTypes.STRING, allowNull: true },

  role: {
    type: DataTypes.ENUM('org_admin', 'hr', 'manager', 'recruiter', 'job_seeker'),
    allowNull: false
  },

  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },

  invite_token: { type: DataTypes.STRING(128), allowNull: true },

  // ⭐ OTP FIELDS
  otp_code: { type: DataTypes.STRING, allowNull: true },
  otp_expiry: { type: DataTypes.DATE, allowNull: true },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  reset_otp: { type: DataTypes.STRING, allowNull: true },
  reset_expiry: { type: DataTypes.DATE, allowNull: true },

  // ⭐ NEW ORG DETAILS (added here!)
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },

  website_url: {
    type: DataTypes.STRING,
    allowNull: true
  },

  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  contact_number: {
    type: DataTypes.STRING,
    allowNull: true
  },

  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',
  timestamps: false,
});

Organization.hasMany(User, { foreignKey: 'organization_id' });
User.belongsTo(Organization, { foreignKey: 'organization_id' });
