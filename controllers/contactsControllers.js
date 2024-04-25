import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";
import { updateContactSchema } from "../schemas/contactsSchemas.js";

// GET /api/contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    return res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

// GET /api/contacts/:id
export const getOneContact = async (req, res, next) => {
  const { id } = req.params; // Отримуємо id з URL;
  try {
    const contact = await contactsService.getContactById(id);
    if (!contact) {
      throw new HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
    next(error);
  }
};

// DELETE /api/contacts/:id
export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const removedContact = await contactsService.removeContact(id);
    if (!removedContact) {
      throw new HttpError("Not found", 404);
    }
    res.status(200).json(removedContact);
  } catch (error) {
    next(error);
  }
};

// POST /api/contacts
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }
    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

// PUT /api/contacts/:id
export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { name, email, phone } = req.body;
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }
    const updatedContact = await contactsService.updateContact(id, {
      name,
      email,
      phone,
    });
    if (!updatedContact) {
      throw new HttpError(404, "Not found");
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
