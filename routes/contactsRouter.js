import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactFavoriteStatus,
} from "../controllers/contactsControllers.js";

import authTokenUsePassport from "../middleware/authTokenUsePassport.js";
import authToken from "../middleware/authToken.js";

// оголошення змінной локально з присвоєнням midleware express для репарсеру req.body та передача її перед викликом певних методів у яких потрібно зчитування reg.body в запитах: POST в createContact, PUT в updateContact.
const jsonParser = express.json();

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", jsonParser, authToken, createContact);

contactsRouter.put("/:id", jsonParser, updateContact);

contactsRouter.patch(
  "/:contactId/favorite",
  jsonParser,
  updateContactFavoriteStatus
);

export default contactsRouter;
