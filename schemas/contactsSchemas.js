//бібла валідації аналог yup
// npm i Joi
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
});

// Schema for validating PATCH /api/contacts/:contactId/favorite
export const validateFavoriteBody = Joi.object({
  favorite: Joi.boolean().required(),
});
