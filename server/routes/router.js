const express = require("express");
const route = express.Router();

const courses = require("../model/courses.json");

// pass a path (e.g., "/") and callback function to the get method
//  when the client makes an HTTP GET request to the specified path,
//  the callback function is executed
route.get("/", async (req, res) => {
  // the res parameter references the HTTP response object
  res.render("index");
});

route.get("/dataView", (req, res) => {
  res.render("dataView", {});
});

route.get("/coursesEdit", (req, res) => {
  res.render("coursesEdit", { courses });
});

route.get("/endpoint", (req, res) => {
  res.json(courses);
});

// delegate all authentication to the auth.js router
route.use("/auth", require("./auth"));

module.exports = route;
