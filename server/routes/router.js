const express = require("express");
const route = express.Router();
const fs = require("fs");

let courses = require("../model/courses.json");
let classrooms = require("../model/classrooms.json");
let teachers = require("../model/teachers.json");

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

route.get("/classroomsEdit", (req, res) => {
  updateValues();
  res.render("classroomsEdit", { courses, classrooms });
});

route.get("/fetchEditCourses", (req, res) => {
  updateValues();
  res.json([courses, classrooms]);
});

route.get("/fetchEditClassrooms", (req, res) => {
  updateValues();
  res.json([classrooms, courses]);
});

route.post("/updateCourses", async (req, res) => {
  fs.writeFileSync("server/model/courses.json", JSON.stringify(req.body));
  updateValues();
  res.status(201).end();
});

route.post("/updateClassrooms", async (req, res) => {
  fs.writeFileSync("server/model/classrooms.json", JSON.stringify(req.body));
  updateValues();
  res.status(201).end();
});

// delegate all authentication to the auth.js router
route.use("/auth", require("./auth"));

const updateValues = function () {
  courses = JSON.parse(fs.readFileSync("server/model/courses.json"));
  classrooms = JSON.parse(fs.readFileSync("server/model/classrooms.json"));
  teachers = JSON.parse(fs.readFileSync("server/model/teachers.json"));
};

module.exports = route;
