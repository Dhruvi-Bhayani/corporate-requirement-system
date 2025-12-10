import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const DB_NAME = process.env.DB_NAME || "railway";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "rNqpvGXQecroCvErfsHtcklWkGXjGzVB";
const DB_HOST = process.env.DB_HOST || "mysql.railway.internal";
const DB_PORT = Number(process.env.DB_PORT || 3306);

console.log("✅ DB CONFIG:", {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_NAME,
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
