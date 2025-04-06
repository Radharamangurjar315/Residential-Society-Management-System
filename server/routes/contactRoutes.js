const express = require("express");
const router = express.Router();

const Contact = require("../models/contact");
const {verifyAdmin} = require("../middlewares/verifyAdmin");
// const requiredLogin = require("../middlewares/requiredLogin");
// const {verifySociety} = require("../middlewares/verifySociety");
const {authenticate} = require("../middlewares/authenticateMiddleware");


// ➕ Admin: Add a contact
router.post("/add", verifyAdmin, async (req, res) => {
  const { name, designation, phone } = req.body;
  try {
    const contact = new Contact({
      name,
      designation,
      phone,
      societyId: req.user.societyId,
    });
    const saved = await contact.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Could not add contact" });
  }
});

// 👁️ Resident/Admin: View contacts in their society
router.get("/:societyId", async (req, res) => {
  try {
    const contacts = await Contact.find({ societyId: req.params.societyId });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch contacts" });
  }
});

module.exports = router;
