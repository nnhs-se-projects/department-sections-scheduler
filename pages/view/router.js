const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const path = require("path");
const scheduler = require("../../Scheduler.js");


const router = express.Router();
const client = new OAuth2Client(process.env.CLIENT_ID);


// POST route for Google OAuth token verification
router.post("/", async (req, res) => {
  const { token } = req.body; // Get token from request body


  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID, // Ensure this matches your Google client ID
    });


    const payload = ticket.getPayload();
    const email = payload.email; // Extract email from the payload


    // Store email in session
    req.session.email = email;


    // Send response with success and email
    res.json({ success: true, email, redirectUrl: "view/index.html" });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});


// GET route for the homepage (index.html)
router.get("/", (req, res) => {
  const options = {
    root: path.join(__dirname, "../../public"), // Serve from public folder
  };


  const fileName = "index.html"; // File to send
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error loading page.");
    } else {
      console.log("Sent:", fileName);
    }
  });
});


// Logout route to destroy session
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/"); // Redirect to home or login page
  });
});


// Routes for scheduler functionality
router.get("/createSchedule", (req, res) => {
  scheduler.createSchedule((data) => {
    res.json({
      data: data,
      courses: scheduler.getCourseData(),
      teachers: scheduler.getTeacherData()
    });
  });
});


// File download routes
router.get("/downloadCSV", (req, res) => {
  if (req.query.data) {
    try {
      scheduler.writeToCSV(JSON.parse(req.query.data));
      const file = path.join(__dirname, "../../output.csv");
      res.download(file, "schedule.csv", (err) => {
        if (err) {
          console.error("Error downloading CSV:", err);
          res.status(500).send("Error downloading file.");
        }
      });
    } catch (error) {
      console.error("Error processing CSV data:", error);
      res.status(400).send("Invalid data format.");
    }
  } else {
    res.status(400).send("No data provided.");
  }
});


// Ensure the router is exported
module.exports = router;


