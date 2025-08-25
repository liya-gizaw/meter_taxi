// config/sequelize.js
import { Sequelize } from "sequelize";

// adjust these values to match your .env file or DB settings
const sequelize = new Sequelize(
  process.env.DB_NAME || "user_service",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
