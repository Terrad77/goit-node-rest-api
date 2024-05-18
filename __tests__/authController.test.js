import { loginUser } from "../controllers/authControllers"; // Імпортуємо контролер для тестування
import jwt from "jsonwebtoken"; // Імпортуємо jwt для створення токена

describe("loginUser", () => {
  let req, res;

  // Підготовка до тесту перед кожним запуском
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
    };
  });

  it("повинен повертати статус-код 200, токен та об'єкт користувача", async () => {
    // Мокуємо функцію генерації токена
    jwt.sign = jest.fn().mockReturnValue("mocked_token");

    // Викликаємо контролер
    await loginUser(req, res);

    // Перевіряємо, що статус відповіді дорівнює 200
    expect(res.status).toHaveBeenCalledWith(200);

    // Перевіряємо, що був повернутий токен
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: "mocked_token" })
    );

    // Перевіряємо, що об'єкт користувача містить поля email та subscription типу String
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: {
          email: expect.any(String),
          subscription: expect.any(String),
        },
      })
    );
  });
});
