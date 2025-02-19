const express = require("express");
const route = express.Router();
const path = require("path");
const fs = require("fs");

const scheduler = require("./Scheduler.js");

// pass a path (e.g., "/") and callback function to the get method
//  when the client makes an HTTP GET request to the specified path,
//  the callback function is executed
route.get("/", async (req, res) => {
  const options = {
    root: path.join(__dirname)
  };

  const fileName = 'pages/view/index.html';
  res.sendFile(fileName, options, function (err) {
      if (err) {
          console.error('Error sending file:', err);
      } else {
          console.log('Sent:', fileName);
      }
  });
});

route.get("/edit", async (req, res) => {
  const options = {
    root: path.join(__dirname)
  };

  const fileName = 'pages/edit/index.html';
  res.sendFile(fileName, options, function (err) {
      if (err) {
          console.error('Error sending file:', err);
      } else {
          console.log('Sent:', fileName);
      }
  });
});

route.get("/createSchedule", (req, res) => {
    scheduler.createSchedule((data) => {
        res.end(JSON.stringify({data:data, courses: scheduler.getCourseData(), teachers: scheduler.getTeacherData()}));
    }); 
});


route.get('/downloadCSV', function(req, res){
  if(req.query.data!=null){
    try{
      scheduler.writeToCSV(JSON.parse(req.query.data))
      const file = `${__dirname}/downloads/schedule.csv`;
      res.download(file);
    }catch(err){
      res.send("Error: "+err)
    }
  }else{
    res.end()
  }
});

route.get('/downloadJSON', function(req, res){
  if(req.query.data!=null){
    try{
      scheduler.writeToJSON(JSON.parse(req.query.data))
      const file = `${__dirname}/downloads/schedule.json`;
      res.download(file);
    }catch(err){
      res.send("Error: "+err)
    }
  }else{
    res.end()
  }
});


route.get("/dataView", (req, res) => {
  res.render("dataView", { courses, classrooms, teachers });
});

route.get("/coursesEdit", (req, res) => {
  updateValues();
  res.render("coursesEdit", { courses, classrooms });
});

route.get("/classroomsEdit", (req, res) => {
  updateValues();
  res.render("classroomsEdit", { courses, classrooms });
});

route.get("/teachersEdit", (req, res) => {
  updateValues();
  res.render("teachersEdit", { teachers, courses });
});

route.get("/fetchEditCourses", (req, res) => {
  updateValues();
  res.json([courses, classrooms, teachers]);
});

route.get("/fetchEditClassrooms", (req, res) => {
  updateValues();
  res.json([classrooms, courses]);
});

route.get("/fetchEditTeachers", (req, res) => {
  updateValues();
  res.json([teachers, courses]);
});

route.get("/getSchedule", (req, res) => {
  updateValues();
  res.json(getSchedule());
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

route.post("/updateTeachers", async (req, res) => {
  fs.writeFileSync("server/model/teachers.json", JSON.stringify(req.body));
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
