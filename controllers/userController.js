import Jimp from "jimp";
import { promises as fs } from "fs";
import User from "../models/User.js";
import path from "path";
import { error, log } from "console";
import sendVerificationEmail from "../services/mail.js";

// імпорт адреси папки C:\Users\terlo\Documents\GitHub\goit-node-rest-api\public\avatars
const avatarsDir = path.resolve("public", "avatars");

// Контролер для оновлення аватарки користувача

// PATCH /users/avatars
const updateAvatar = async (req, res, next) => {
  try {
    // Знайти користувача за ID
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    // обробка завантаженого файлу for example: user.png

    // вилучення з деструктуризацією властивостей path та originalname з об'єкта req.file
    const { path: tempUpload, originalname } = req.file;

    const ext = path.extname(originalname); // ext ->  .png
    const name = path.basename(originalname, ext); // name ->  user
    const newFilename = `${req.user.id}_${name}${ext}`; // newFilename -> 663e314c59bf2fa04eef430e_user.png
    const resultUpload = path.resolve(avatarsDir, newFilename); // resultUpload -> path to file

    // Обробка аватару пакетом jimp, resize 250*250
    await Jimp.read(tempUpload)
      .then((image) => image.resize(250, 250).write(resultUpload))
      .catch((err) => {
        // throw new Error(err);
        next(error);
      });

    // Видалити тимчасовий файл
    await fs.unlink(tempUpload);

    // збереження URL в поле avatarURL користувача
    const avatarURL = `/avatars/${newFilename}`;
    user.avatarURL = avatarURL;
    await user.save();

    // Відповісти з новим URL аватару
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

// Контролер  веріфікації email

// GET /users/ verify/ :verificationToken

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    // Clear the verificationToken and set the user as verified
    const user = await User.findOneAndUpdate(
      { verificationToken },
      { verify: true, verificationToken: " " }
    );

    // Verification user Not Found
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    // save user
    await user.save();

    // Verification success response
    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

// Контролер повторної відправки

// POST /users/ verify/ :verificationToken
const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    //  Якщо в body немає обов'язкового поля email
    if (!email) {
      return res.status(400).send({ message: "missing required field email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Якщо користувач вже пройшов верифікацію
    if (user.verify === true) {
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });
    }

    // повторна відправка листа з verificationToken на вказаний email
    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

export default { updateAvatar, verify, resendVerificationEmail };
