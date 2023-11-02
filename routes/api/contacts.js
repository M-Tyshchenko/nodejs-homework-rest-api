const express = require("express");
// const cors = require("cors");
const { listContacts, getContactById } = require("../../models/contacts");

const router = express.Router();

// router.use(cors());

router.get("/", async (_, res, next) => {
  listContacts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => next(err));
  
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.url.slice(1, req.url.length);
  // console.log({ id });

    getContactById(id)
      .then((data) => {
        if (data === undefined) {
          res.json({ message: "Not found" })
        }
      res.json(data);
    })
    .catch((err) => next(err));
  // res.json({ message: "template message" });
});

router.post("/contacts", async (req, res, next) => {
  // res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  // res.json({ message: "template message" });
  const id = req.url.slice(1, req.url.length);
  removeContact(id)
      .then((data) => {
        if (data === undefined) {
          res.json({ message: "Not found" })
        }
      res.json({ message: "Contact deleted" });
    })
    .catch((err) => next(err));
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
