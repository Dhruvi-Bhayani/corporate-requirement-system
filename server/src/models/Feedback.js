import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { User } from "./User.js";

export const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "feedback",
    timestamps: false,
  }
);

User.hasMany(Feedback, { foreignKey: "user_id" });
Feedback.belongsTo(User, { foreignKey: "user_id" });

export default Feedback;
