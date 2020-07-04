//General Imports
const Entry = require("../models/entry");

require("dotenv").config();

exports.crawlEntries = (req, res) => {
  (async () => {
    let websiteId = req.params.id;
    const crawloperation = require(`../operations/${websiteId}`);

    await crawloperation.initialize();
    const results = await crawloperation.getResults();

    const nameExists = await Entry.findOne({
      companyName: results.companyName,
    });
    if (nameExists)
      return res.status(403).json({
        error: "Es existiert bereits ein Eintrag über dieses Unternehmen.",
        companyName,
      });

    await Entry.insertMany(results, { ordered: false }, function (err) {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res
        .status(200)
        .json({ message: "Einträge wurden zur Prüfung freigegeben." });
    });
  })();
};
