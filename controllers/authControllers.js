import HttpError from "../helpers/HttpError.js";
import { registerUserSchema } from "../schemas/usersSchemas.js";
import User from "../models/User.js";
//npm i bcrypt - бібл хешування
import bcrypt from "bcrypt";

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

    // Хешування паролю у bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Створення нового користувача
    await User.create({
      email: req.body.email,
      password: hashedPassword,
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
    const isMatch = await bcrypt.compare(req.body.password, existUser.password);
    if (isMatch === false) {
      console.log("Password is wrong");
      // Login auth error
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    // const payload = {
    //   id: user.id,
    //   username: user.username,
    // };
    // const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    // res.json({
    //   status: "success",
    //   code: 200,
    //   data: {
    //     token,
    //   },
    // });
  } catch (error) {
    next(error);
  }
};

// GET /user/list
export const listUser = async (req, res, next) => {
  const { username } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      message: `Authorization was successful: ${username}`,
    },
  });
};
export default {
  registerUser,
  loginUser,
};
