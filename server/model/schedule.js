/**
 * schema for a journal entry
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  schedule: {
    type: Array,
    required: true,
  },
});

const Entry = mongoose.model("Schedule", schema);

module.exports = Entry;
