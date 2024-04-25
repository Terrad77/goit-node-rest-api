import Joi from "joi";

// Schema for validating POST /api/contacts
export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

// Schema for validating PUT /api/contacts/:id
export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
})
  .or("name", "email", "phone")
  .options({ allowUnknown: true });
