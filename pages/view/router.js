const express = require("express");
const route = express.Router();
const path = require("path");
const fs = require("fs");

const scheduler = require("../../Scheduler.js");



let customTeachers = null
let customCourses = null
let customClassrooms = null

// pass a path (e.g., "/") and callback function to the get method
//  when the client makes an HTTP GET request to the specified path,
//  the callback function is executed
//app.use(express.static(__dirname + '/pages'));
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

route.get("/createSchedule", async (req, res) => {
    await scheduler.loadFromFile()
    if(customTeachers!=null){
        scheduler.setTeacherData(customTeachers)
    }
    if(customCourses!=null){
        scheduler.setCourseData(customCourses)
    }
    if(customClassrooms!=null){
        scheduler.setClassroomData(customClassrooms)
    }
    scheduler.createSchedule((data) => {
        res.end(JSON.stringify({data:data, courses: scheduler.getCourseData(), teachers: scheduler.getTeacherData()}));
    }); 
});

const bodyParser = require('body-parser');
route.use(bodyParser.urlencoded({ extended: true }));

route.post('/downloadCSV', function(req, res){
  if(req.body){
    try {
      scheduler.writeToCSV(req.body);
      const file = `${__dirname}/downloads/schedule.csv`;
      res.download(file);
    } catch(err) {
      res.send("Error: "+err);
    }
  } else {
    res.status(400).send("No data provided");
  }
});



route.post('/downloadJSON', function(req, res){
  if(req.body){
    try {
      scheduler.writeToJSON((req.body));
      const file = `${__dirname}/downloads/schedule.json`;
      res.download(file);
    } catch(err) {
      res.send("Error: "+err);
    }
  } else {
    res.status(400).send("No data provided");
  }
});



route.post('/resetCustomData', function(req, res){
  customTeachers = null
  customCourses = null
  customClassrooms = null
  res.end()
});

route.post('/uploadCustomData', function(req, res){
  if(req.body!=null){
    try{
      const data = req.body
      if(data.sem1 && data.sem1[0] && data.sem1[0].name && data.sem1[0].coursesAssigned){
        customTeachers = data.sem1
      }else if(data.sem1 && data.sem1[0] && data.sem1[0].name && data.sem1[0].name && data.sem1[0].sections){
        customCourses = data.sem1
      }else if(data.sem1 && data.sem1[0] && data.sem1[0].roomNum && data.sem1[0].periodsAvailable){
        customClassrooms = data.sem1
      }
      
/*

      "name": "Business Law",
      "sections": 1,
      "compatibleClassrooms": ["128", "126", "120"],
      "compatiblePeriods": [1, 2, 3, 4, 5, 6, 7, 8],
      "block": false,
      "lockTo": null

    {
      "roomNum": "117",
      "periodsAvailable": [1, 2, 3, 4, 5, 6, 7, 8]
    }

*/


    }catch(err){
      res.send("Error: "+err)
    }
  }else{
    res.end()
  }
});


module.exports = route;

