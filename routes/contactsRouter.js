import express from "express";
import ContactsController from "../controllers/contactsControllers.js";

// локальний імопрт midleware express для репарсеру req.body
const jsonParser = express.json();

// створити екземпляр роутера
const contactsRouter = express.Router();

// додаємо мідлвари:
// jsonParser - в методи де є зчитування reg.body в запитах,
// authTokenUsePassport - де потрібна авторізація, або якщо авторізація потрібна усюди, цю мідлвар можна просто додати в app на весь роут /api/contacts"
contactsRouter.get("/", ContactsController.getAllContacts);
contactsRouter.get("/:id", ContactsController.getOneContact);
contactsRouter.delete("/:id", ContactsController.deleteContact);
contactsRouter.post("/", jsonParser, ContactsController.createContact);
contactsRouter.put("/:id", jsonParser, ContactsController.updateContact);
contactsRouter.patch(
  "/:contactId/favorite",
  jsonParser,
  ContactsController.updateContactFavoriteStatus
);

export default contactsRouter;
