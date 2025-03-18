const express = require("express");
const route = express.Router();
const path = require("path");
const fs = require("fs");

const scheduler = require("../../Scheduler.js");

module.exports = route;

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


route.post('/downloadCSV', function(req, res) {
  try {
    if (!req.body.data) throw new Error("No data provided"); // Access data from POST body
    scheduler.writeToCSV(req.body.data);
    const file = `${__dirname}/downloads/schedule.csv`;
    res.download(file);
  } catch(err) {
    res.status(400).send("Error: " + err.message);
  }
});

route.post('/downloadJSON', function(req, res) {
  try {
    if (!req.body.data) throw new Error("No data provided"); // Access data from POST body
    scheduler.writeToJSON(req.body.data); // No need to parse; body is already parsed by middleware
    const file = `${__dirname}/downloads/schedule.json`;
    res.download(file);
  } catch(err) {
    res.status(400).send("Error: " + err.message);
  }
});
