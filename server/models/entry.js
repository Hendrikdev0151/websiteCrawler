const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    trim: true,
    required: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  updated: Date,
});

module.exports = mongoose.model("Entry", entrySchema);
