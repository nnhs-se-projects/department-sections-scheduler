/**
 * schema for a data entry
 */

const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  classrooms: {
    type: Object,
    required: true,
  },
  courses: {
    type: Object,
    required: true,
  },
  teachers: {
    type: Object,
    required: true,
  },
});

const Entry = mongoose.model("Department", departmentSchema);

module.exports = Entry;
