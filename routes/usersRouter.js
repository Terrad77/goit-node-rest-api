import express from "express";
import UserController from "../controllers/userController.js";
import uploadMiddleware from "../middleware/upload.js";
import authToken from "../middleware/authToken.js";

// імпорт у змінну результату виконання express роутера
const router = express.Router();

// PATCH / users / avatars
router.patch(
  "/avatars",
  authToken,
  uploadMiddleware.single("avatar"),
  UserController.updateAvatar
);

// GET /users/ verify/ :verificationToken
router.get("/verify/:verificationToken", UserController.verify);

// POST /users/ verify/ :verificationToken
router.post("/verify", UserController.resendVerificationEmail);

export default router;
