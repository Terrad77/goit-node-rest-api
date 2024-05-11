import express from "express";
import AuthController from "../controllers/authControllers.js";
// import authToken from "../middleware/authToken.js";
import authTokenUsePassport from "../middleware/authTokenUsePassport.js";

// midleware для репарсеру req.body
const jsonParser = express.json();

// сторення об'єкта роутера express
const usersRouter = express.Router();

// Маршрути
usersRouter.post("/register", jsonParser, AuthController.registerUser);

usersRouter.post("/login", jsonParser, AuthController.loginUser);

usersRouter.post("/logout", authTokenUsePassport, AuthController.logoutUser);

usersRouter.post("/current", authTokenUsePassport, AuthController.logoutUser);

usersRouter.get(
  "/users/current",
  authTokenUsePassport,
  AuthController.getCurrentUser
);

export default usersRouter;
