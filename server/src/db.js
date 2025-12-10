import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const DB_NAME = process.env.MYSQL_DATABASE;
const DB_USER = process.env.MYSQLUSER;
const DB_PASSWORD = process.env.MYSQLPASSWORD;
const DB_HOST = process.env.MYSQLHOST;
const DB_PORT = Number(process.env.MYSQLPORT || 3306);

console.log("✅ DB CONFIG:", {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_NAME,
  DB_PASSWORD: DB_PASSWORD ? "✅ Loaded" : "❌ Missing",
});

export const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);
