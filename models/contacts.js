const fs = require("fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  const contact = JSON.parse(contacts).find((contact) => contact.id === contactId);
  
  // if (contact === undefined) {
  //   return null;
  // }

  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  const index = contacts.findIndex((contact) => contact.id === contactId);
  
  if (index === -1) {
    return null;
  }

  const removedContact = contacts.splice(index, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));

  return removedContact;
};

const addContact = async (body) => {
  // const { name, email, phone } = body;
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  const newContact = { id: crypto.randomUUID(), ...body };

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  const index = contacts.findIndex((contact) => contact.id === contactId);
  
  if (index === -1) {
    return null;
  }

  const updatedContact = contacts.splice(index, 1, {id: contactId, ...body});

  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));

  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
