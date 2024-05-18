import { registerUser } from "../controllers/authControllers.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import jwt from "jsonwebtoken"; // Імпортуйте jwt для створення токена
import { registerUserSchema } from "../schemas/usersSchemas.js";

// мокаємо модулі, щоб контролювати їх поведінку та уникати реальних викликів під час тестування.
jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("gravatar");
jest.mock("jsonwebtoken"); // Мокуємо jwt

describe("registerUser", () => {
  let req, res, next;

  // початковий стан req, res, та next перед кожним тестом
  beforeEach(() => {
    req = {
      body: {
        email: "test@test.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it("повинен повертати статус-код 200, токен та об'єкт користувача", async () => {
    const token = "mocked_token";
    const hashedPassword = "hashed_password";
    const expectedUser = {
      email: req.body.email,
      subscription: "starter",
    };

    bcrypt.hash.mockResolvedValue(hashedPassword);
    gravatar.url.mockReturnValue("gravatar_url");
    jwt.sign.mockReturnValue(token); // Мокуємо повернення токена

    User.create.mockResolvedValue({
      email: req.body.email,
      password: hashedPassword,
      avatarURL: "gravatar_url",
    });

    await registerUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token,
      user: {
        email: expectedUser.email,
        subscription: expectedUser.subscription,
      },
    });
  });

  it("повинен повертати статус-код 400 при помилці валідації", async () => {
    // Валідаційна схема мокована для тестування помилок валідації.
    registerUserSchema.validate = jest.fn().mockReturnValue({
      error: { message: "Validation error" },
    });

    await registerUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: "Validation error" });
  });

  it("повинен повертати статус-код 409 якщо email вже використовується", async () => {
    User.findOne.mockResolvedValue(true);

    await registerUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith({ message: "Email in use" });
  });

  it("повинен викликати next(error) у разі помилки", async () => {
    const error = new Error("Database error");
    User.findOne.mockRejectedValue(error);

    await registerUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
