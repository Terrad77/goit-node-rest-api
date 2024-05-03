import mongoose from "mongoose";

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
  },
  { versionKey: false } // відключення додавання параметру __v (версіонування)
);

// Створення моделі на основі схеми
const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
