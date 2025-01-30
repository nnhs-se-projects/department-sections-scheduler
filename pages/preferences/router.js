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