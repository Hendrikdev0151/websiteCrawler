const express = require("express");
const { getAllEntries } = require("../controllers/entries");

const router = express.Router();

router.get("/entries", getAllEntries);

module.exports = router;
