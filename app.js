import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import mongoose from "mongoose";

// const mongoose = require("mongoose");

//connection string
const DB_URI =
  "mongodb+srv://Dima:terrad77@cluster0.wrlinfw.mongodb.net/?retryWrites=true&w=majority";
async function run() {
  try {
    //connection to DB
    await mongoose.connect(DB_URI);
    //try ping to DB for test
    // await mongoose.connection.db.admin().command({ ping: 1 });
    console.info("Database connection successful");
  } catch (error) {
    console.error(error);
  } finally {
    //disconect from DB
    // await mongoose.disconnect();
    await process.exit(1);
  }
}
//testing function run
// run();
// run().catch((error) => console.error(error));

const app = express();

app.use(morgan("tiny"));
app.use(cors());

// вар.1, midleware express для репарсеру req.body, тут оголошена глобально та спрацьовує на кожний http запит хоча потрібна лише для POST, PUT, PATCH
// app.use(express.json());

// вар.2,  bestpractic - використовуавти як локальну midleware в роутах, передаючи в параметри jsonParser перед (req, res) або перед викликом функції з (req, res) у contactsRouter.js
// const jsonParser = express.json();

app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
