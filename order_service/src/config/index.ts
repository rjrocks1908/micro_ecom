import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  CATALOG_BASE_URL: process.env.CATALOG_BASE_URL,
  AUTH_SERVICE_BASE_URL: process.env.AUTH_SERVICE_BASE_URL,
};
