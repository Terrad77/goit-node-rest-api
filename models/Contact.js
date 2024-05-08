import mongoose, { Schema } from "mongoose";

// схема для збереження моделі колекції contacts у MongoDB
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    // щоб кожен користувач бачив тільки свої контакти, додаємо властивість owner, де 'user' - назва колекції де зберігаються користувачи
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false } // відключення додавання параметру __v (версіонування)
);

// Створення моделі "Contact" на основі схеми contactSchema
const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
