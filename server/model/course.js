/**
 * schema for a journal entry
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sections: {
    type: Number,
    required: true,
  },
  compatibleClassrooms: {
    type: Array,
    required: true,
  },
  compatiblePeriods: {
    type: Array,
    required: true,
  },
  schedulingPriority: {
    type: Number,
    required: false,
  },
});

const Entry = mongoose.model("Course", schema);

module.exports = Entry;
