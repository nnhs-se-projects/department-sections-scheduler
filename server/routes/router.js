const express = require("express");
const route = express.Router();
const fs = require("fs");

let courses = require("../model/courses.json");
const classrooms = require("../model/classrooms.json");

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
  updateValues();
  res.render("coursesEdit", { courses, classrooms });
});

route.get("/fetchEditCourses", (req, res) => {
  res.json([courses, classrooms]);
});

route.get("/fetchEditClassrooms", (req, res) => {
  res.json(classrooms);
});

route.post("/updateCourses", async (req, res) => {
  // const entry = new Entry({
  //   date: req.body.date,
  //   email: req.session.email,
  //   habit: req.body.habit,
  //   content: req.body.content,
  // });
  // await entry.save();
  fs.writeFileSync("server/model/courses.json", JSON.stringify(req.body));
  updateValues();
  res.status(201).end();
});

// delegate all authentication to the auth.js router
route.use("/auth", require("./auth"));

const updateValues = function () {
  courses = JSON.parse(fs.readFileSync("server/model/courses.json"));
};

module.exports = route;
