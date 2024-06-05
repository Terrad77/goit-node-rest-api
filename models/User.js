import mongoose from "mongoose";
// схема для збереження моделі колекції users у MongoDB
const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false } // відключення додавання параметру __v (версіонування)
);

// Створення моделі на основі схеми User та перевірка, чи модель User вже існує
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
