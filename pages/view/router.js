const express = require("express");
const route = express.Router();
const path = require("path");
const fs = require("fs");

const scheduler = require("../../Scheduler.js");



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

route.get("/createSchedule", (req, res) => {
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

/*
route.post('/downloadJSON', function(req, res){
  if(req.body){
    try {
      //scheduler.writeToJSON(req.body);
      const file = `/downloads/schedule.json`;
      console.log("yippee!");
      res.download(file);
    } catch(err) {
      console.log(err);
      res.send("Error: "+err);
    }
  } else {
    res.status(400).send("No data provided");
  }
});*/


module.exports = route;
