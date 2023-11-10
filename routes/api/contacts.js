const express = require("express");
require("./db");

const ContactController = require("../../controllers/contact");

const jsonParser = express.json();

const router = express.Router();

router.get("/", ContactController.listContacts);
  
router.get("/:contactId", ContactController.getContactById);

router.post("/", jsonParser, ContactController.addContact);

router.delete("/:contactId", ContactController.removeContact);

router.put("/:contactId", jsonParser, ContactController.updateContact);

router.patch("/:contactId/favorite", jsonParser, ContactController.updateStatusContact);

module.exports = router;
