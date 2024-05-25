import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import mongoose from "mongoose";
import authTokenUsePassport from "./middleware/authTokenUsePassport.js";
// import authToken from "./middleware/authToken.js";
import usersRoutes from "./routes/usersRouter.js";
import "dotenv/config";
import path from "path";

// Створення додатку
const app = express();

// Middleware для логування, CORS та парсингу JSON
app.use(morgan("tiny")); //
app.use(cors());
app.use(express.json());

// Налаштування роздачі статичних файлів  (розширення app міддлварою   express.static('public'))
// При переході за URL: http://localhost:3000/avatars/user.png - браузер відобразить зображення
app.use("/avatars", express.static(path.resolve("public/avatars")));

// підключення маршрутів - роутів до додатку app
app.use("/api/contacts", authTokenUsePassport, contactsRouter);
app.use("/api/users", authRouter);
app.use("/users", usersRoutes);

// middleware обробки запитів неіснуючих маршруту
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});
// middleware - обробник помилок
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// імпорт URI бази даних з змінної середовища (DB_URI, файлу .env)
const DB_URI = process.env.DB_URI;

// Підключення до бази даних перед запуском сервера
mongoose
  .connect(DB_URI)
  .then(() => {
    console.info("Database connection successful");

    // призначення PORT
    const PORT = process.env.PORT || 3000;

    // Старт сервера після успішного підключення до бази даних
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    // обробка помилки
    console.error("Database connection error:", error);
    // завершити процес
    process.exit(1);
  });
