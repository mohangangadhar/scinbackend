require("dotenv").config();
import express, { Request, Response } from "express";
// import morgan from "morgan";
import cors from "cors";
import { connectDB, sequelize } from "./db";
import router from "../src/routes/routes";

const app = express();

// app.use(express.json({ limit: "10kb" }));
// if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(cors());
app.use("/", router);

const PORT = 5000;
app.listen(PORT, async () => {
  console.log("Server started Successfully");
  await connectDB();
  sequelize.sync({ force: false }).then(() => {
    console.log("Database Connected Successfully");
  });
});
