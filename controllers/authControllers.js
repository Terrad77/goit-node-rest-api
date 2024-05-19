import { registerUserSchema } from "../schemas/usersSchemas.js";
import User from "../models/User.js";

//npm i bcrypt - бібл хешування
import bcrypt from "bcrypt";

// npm install jsonwebtoken
import jwt from "jsonwebtoken";
// генератор аватарів
import gravatar from "gravatar";

// ----------------- Реєстрація нового користувача ---------- //

// POST /api/users/register
export const registerUser = async (req, res, next) => {
  // Валідація тіла запиту за схемою Joi
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    // Registration validation error
    return res.status(400).send({ message: error.message });
  }

  try {
    // Валідація моделі User, чи користувач з наданним email вже існує, findOne повертає об'єкт або null
    const existUser = await User.findOne({ email: req.body.email });

    if (existUser !== null) {
      // Registration conflict error
      return res.status(409).send({ message: "Email in use" });
    }
    // Витягаємо email з тіла запиту
    const { email, password } = req.body;

    // Хешування паролю у bcrypt з кількістю salt = 10
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // створення  URL на автар за email користувача
    const avatar = gravatar.url(email, { s: "250", d: "retro" }, true);

    // Створення нового користувача + URL до згенерованого аватару
    await User.create({
      email: email,
      password: hashedPassword,
      avatarURL: avatar,
    });

    // Registration success response
    res.status(201).send({
      user: {
        email: req.body.email,
        subscription: "starter",
      },
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Отримання jwt-токена ------------------ //
// POST /api/users/login
export const loginUser = async (req, res, next) => {
  // Валідація тіла запиту за схемою Joi
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    // Login validation error
    return res.status(400).send({ message: error.message });
  }
  try {
    // Валідація моделі User, чи користувач з наданним email вже існує у базі
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser === null) {
      console.log("Email is wrong");
      // Login auth error
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    // Перевірка наданого password на валідність (compare() перевіряє чи є 2й аргумент захешованою версією 1го, повертає boolean )
    const isMatch = await bcrypt.compare(req.body.password, existUser.password);
    if (isMatch === false) {
      console.log("Password is wrong");
      // Login auth error
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    // -----------  створення токену ----------------- //

    // Створюємо payload об'єкт
    console.log("Creating token...");
    const payload = { id: existUser.id };
    // Отримання значення  SECRET з змінної середовища, файлу .env
    const secret = process.env.SECRET;
    // збірка токену, виклик функції кодування з модуля jsonwebtoken
    const token = jwt.sign(payload, secret, { expiresIn: "23h" });

    // Збереження токена в поточному користувачі
    existUser.token = token;
    await existUser.save();

    // Login success response

    res.status(200).json({
      token: token,
      user: {
        email: req.body.email,
        subscription: "starter",
      },
    });
  } catch (error) {
    console.log("Error:", error);
    next(error);
  }
};

// -------------------- Видалення jwt-токена  --------------- //
// POST / users / logout;

export const logoutUser = async (req, res, next) => {
  try {
    // Отримати id поточного користувача з req.user
    const userId = req.user._id; // use "id" if middleware authToken

    // пошук користувача у моделі User за _id
    const user = await User.findById(userId);

    // Перевірити, чи користувач існує
    if (user === null) {
      // Logout unauthorized error
      return res.status(401).send({ message: "Not authorized" });
    }

    // Видалити токен у поточного користувача та зберегти у БД
    user.token = null;
    await user.save();

    // Logout success response
    return res.status(204).send("No Content");
  } catch (error) {
    next(error);
  }
};

// -------------------- Отримати дані поточного юзера по токені  --------------- //
// GET / users / current;
export const getCurrentUser = async (req, res, next) => {
  try {
    // Отримати id поточного користувача з req.user
    const userId = req.user._id; // use "id" if middleware authToken

    // пошук користувача у моделі User за _id
    const user = await User.findById(userId);

    // Перевірити, чи користувач існує
    if (user === null) {
      // Logout unauthorized error
      return res.status(401).send({ message: "Not authorized" });
    }
    const result = { email: user.email, subscription: user.subscription };
    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

//-------------- оновлення підписки ---------------------//
// PATCH / users;

export const updateSubscription = async (req, res, next) => {
  const validSubscriptions = ["starter", "pro", "business"];
  const { subscription } = req.body;

  // Перевірка, чи передане значення підписки є дійсним
  if (!validSubscriptions.includes(subscription)) {
    return res.status(400).json({ message: "Invalid subscription value" });
  }

  try {
    // Отримання ідентифікатора користувача з токена
    const userId = req.user.id;

    // Пошук користувача за ідентифікатором
    const user = await User.findById(userId);

    // Перевірка, чи знайдено користувача
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Оновлення підписки користувача
    user.subscription = subscription;
    await user.save();

    // Відправка відповіді з оновленими даними користувача
    res.status(200).json({
      message: "Subscription updated successfully",
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
};
