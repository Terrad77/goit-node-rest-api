import { loginUser } from "../controllers/authControllers.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerUserSchema } from "../schemas/usersSchemas.js";

jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

jest.mock("../schemas/usersSchemas", () => ({
  registerUserSchema: {
    validate: jest.fn().mockReturnValue({ error: null }),
  },
}));

describe("loginUser", () => {
  let req, res, next;

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
    jest.setTimeout(10000); // Збільшуємо таймаут до 10 секунд

    const token = "mocked_token";
    const hashedPassword = "hashed_password";

    User.findOne.mockResolvedValue({
      email: req.body.email,
      password: hashedPassword,
      subscription: "starter",
      id: "mocked_id",
      save: jest.fn().mockResolvedValue(true), // Додаємо метод save
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue(token);

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token,
      user: {
        email: req.body.email,
        subscription: "starter",
      },
    });
  });

  it("повинен повертати статус-код 400 при помилці валідації", async () => {
    registerUserSchema.validate.mockReturnValueOnce({
      error: { message: "Validation error" },
    });

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: "Validation error" });
  });

  it("повинен повертати статус-код 401 якщо email або пароль неправильні", async () => {
    User.findOne.mockResolvedValue({
      email: req.body.email,
      password: "hashed_password",
    });

    bcrypt.compare.mockResolvedValue(false);

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: "Email or password is wrong",
    });
  });

  it("повинен викликати next(error) у разі помилки", async () => {
    const error = new Error("Database error");
    User.findOne.mockRejectedValue(error);

    await loginUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
