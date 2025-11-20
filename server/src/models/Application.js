import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Job } from './Job.js';
import { User } from './User.js';

export const Application = sequelize.define('Application', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },

  job_id: { 
    type: DataTypes.BIGINT, 
    allowNull: false, 
    references: { model: Job, key: 'id' } 
  },

  applicant_id: { 
    type: DataTypes.BIGINT, 
    allowNull: false, 
    references: { model: User, key: 'id' } 
  },

  cover_letter: { type: DataTypes.TEXT },
  resume_url: { type: DataTypes.STRING(1024) },

  // ⭐ UPDATED FULL WORKFLOW STATUS
  status: { 
    type: DataTypes.ENUM(
      'applied',
      'screening',
      'shortlisted',
      'interview_scheduled',
      'selected',
      'rejected'
    ),
    defaultValue: 'applied'
  },

  // ⭐ NEW: FULL STATUS HISTORY LOG
  status_history: {
    type: DataTypes.JSON,
    defaultValue: []
  },

  // ⭐ NEW: INTERVIEW SCHEDULE DATE/TIME
  interview_at: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // ⭐ NEW: NOTES BY RECRUITERS/HR
  recruiter_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  applied_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'applications',
  timestamps: true   // ⭐ IMPORTANT CHANGE
});

// RELATIONS
Job.hasMany(Application, { foreignKey: 'job_id' });
Application.belongsTo(Job, { foreignKey: 'job_id' });

User.hasMany(Application, { foreignKey: 'applicant_id' });
Application.belongsTo(User, { foreignKey: 'applicant_id' });
