import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Job } from './Job.js';
import { User } from './User.js';

export const Application = sequelize.define('Application', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  job_id: { type: DataTypes.BIGINT, allowNull: false, references: { model: Job, key: 'id' } },
  applicant_id: { type: DataTypes.BIGINT, allowNull: false, references: { model: User, key: 'id' } },
  cover_letter: { type: DataTypes.TEXT },
  resume_url: { type: DataTypes.STRING(1024) },
  status: { type: DataTypes.ENUM('applied','screening','interview','offer','rejected'), defaultValue: 'applied' },
  applied_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'applications',
  timestamps: false
});

Job.hasMany(Application, { foreignKey: 'job_id' });
Application.belongsTo(Job, { foreignKey: 'job_id' });

User.hasMany(Application, { foreignKey: 'applicant_id' });
Application.belongsTo(User, { foreignKey: 'applicant_id' });
