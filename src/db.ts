require("dotenv").config();
import { Sequelize, DataTypes } from "sequelize";

const POSTGRES_URL = process.env.DATABASE_URL as string;

console.log(POSTGRES_URL);

const sequelize = new Sequelize(POSTGRES_URL, {
  dialect: "postgres",
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection Successful");
  } catch (error) {
    console.error("Unable to connect to database: ", error);
  }
}

export { connectDB, sequelize, Sequelize, DataTypes };
