/**
 * schema for a journal entry
 */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  roomNum: {
    type: String,
    required: true,
  },
  periodsAvaliable: {
    type: Array,
    required: true,
  },
});

const Entry = mongoose.model("Classroom", schema);

module.exports = Entry;
