import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Organization } from './Organization.js';
import { User } from './User.js';

export const Job = sequelize.define('Job', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  organization_id: { type: DataTypes.BIGINT, references: { model: Organization, key: 'id' } },
  created_by: { type: DataTypes.BIGINT, references: { model: User, key: 'id' } },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  employment_type: { type: DataTypes.ENUM('Full-time','Part-time','Contract','Internship') },
  salary_min: { type: DataTypes.INTEGER },
  salary_max: { type: DataTypes.INTEGER },
  posted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.ENUM('draft','open','closed'), defaultValue: 'open' }
}, {
  tableName: 'jobs',
  timestamps: false
});

Organization.hasMany(Job, { foreignKey: 'organization_id' });
Job.belongsTo(Organization, { foreignKey: 'organization_id' });

User.hasMany(Job, { foreignKey: 'created_by' });
Job.belongsTo(User, { foreignKey: 'created_by' });
