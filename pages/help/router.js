const express = require("express");
const route = express.Router();
const path = require("path");
const fs = require("fs");

module.exports = route;

route.get("/", async (req, res) => {
  const options = {
    root: path.join(__dirname)
  };

  const fileName = './index.html';
  res.sendFile(fileName, options, function (err) {
      if (err) {
          console.error('Error sending file:', err);
      } else {
          console.log('Sent:', fileName);
      }
  });
});

route.get('/getJsonFiles', function(req, res){
  const classrooms = JSON.parse(fs.readFileSync('classrooms.json',{encoding:'utf8',flag:'r'}));
  const courses = JSON.parse(fs.readFileSync('courses.json',{encoding:'utf8',flag:'r'}));
  const teachers = JSON.parse(fs.readFileSync('teachers.json',{encoding:'utf8',flag:'r'}));
  res.send({classrooms:classrooms, courses:courses, teachers:teachers});
});