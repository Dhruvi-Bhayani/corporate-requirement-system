import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { User } from './User.js';

export const Profile = sequelize.define('Profile', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false, unique: true, references: { model: User, key: 'id' } },
  headline: { type: DataTypes.STRING },
  summary: { type: DataTypes.TEXT },
  resume_url: { type: DataTypes.STRING(1024) },
  skills: { type: DataTypes.JSON },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'profiles',
  timestamps: false
});

User.hasOne(Profile, { foreignKey: 'user_id' });
Profile.belongsTo(User, { foreignKey: 'user_id' });
