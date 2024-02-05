/**
 * schema for a journal entry
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  certifiedCourses: {
    type: Array,
    required: true,
  },
  openPeriods: {
    type: Array,
    required: true,
  },
});

const Entry = mongoose.model("Teacher", schema);

module.exports = Entry;
