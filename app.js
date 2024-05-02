import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import mongoose from "mongoose";
// завантаження .env file into process.env
// зробити npm i dotenv
// створити file   .env
// імпортувати модуль
import "dotenv/config";

const app = express();
app.use(morgan("tiny"));
app.use(cors());

// використання  middleware для парсингу JSON
// вар.1,  app.use(express.json()); midleware express для репарсеру req.body, оголоcити глобально, що буде спрацьовувати на кожний http запит, за потреб лише для POST, PUT, PATCH

// вар.2, bestpractic - const jsonParser = express.json();  оголошувати як локальну midleware в роутах, передаючи в параметри змінну jsonParser перед (req, res) або перед викликом функції з (req, res) у contactsRouter.js

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// отримуєм connection string в Atlas>Database>Connect>Drivers за обраним драйвером:
// const uri = "mongodb+srv://<username>:<password>@cluster0.wrlinfw.mongodb.net/<database_name>?retryWrites=true&w=majority&appName=Cluster0";
// де треба змінити на дійсні значення <username>, <password>, <database_name>

// console.log(process.env.DB_URI);

const DB_URI = process.env.DB_URI;

// Підключення до бази даних перед запуском сервера
mongoose
  .connect(DB_URI)
  .then(() => {
    console.info("Database connection successful");
    // Старт сервера після успішного підключення до бази даних
    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    // обробка помилки
    console.error("Database connection error:", error);
    // завершити процес
    process.exit(1);
  });
