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
