import express from "express";

import AuthController from "../controllers/authControllers.js";

// midleware для репарсеру req.body
const jsonParser = express.json();

// сторення об'єкта роутера express
const usersRouter = express.Router();

// Маршрути
usersRouter.post("/register", jsonParser, AuthController.registerUser);

usersRouter.post("/login", jsonParser, AuthController.loginUser);

// usersRouter.get("/list", listUser);

export default usersRouter;
