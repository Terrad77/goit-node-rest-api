import mongoose from "mongoose";

// схема для моделі контакту
const contactSchema = new mongoose.Schema({
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
});

// Створення моделі на основі схеми
const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
