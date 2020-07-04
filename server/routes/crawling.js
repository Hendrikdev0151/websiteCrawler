const express = require("express");
const { crawlEntries } = require("../controllers/crawling");

const router = express.Router();

router.get("/crawlEntries/:id", crawlEntries);

module.exports = router;
