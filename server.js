const path = require("path");
/**
 * main Javascript file for the application
 *  this file is executed by the Node server
 */

// import the express module, which exports the express function
const express = require("express");

// invoke the express function to create an Express application
const app = express();

// load environment variables from the .env file into process.env
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// // connect to the database
// const connectDB = require("./server/database/connection");
// connectDB();

// import the express-session module, which is used to manage sessions
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// add middleware to handle JSON in HTTP request bodies (used with POST commands)
app.use(express.json());
//app.use(express.static(__dirname));
app.use(express.static(__dirname + '/pages'));

// app.use takes a function that is added to the chain of a request.
//  When we call next(), it goes to the next function in the chain.
app.use(async (req, res, next) => {
  // if the student is already logged in, fetch the student object from the database
  // if (req.session.email === undefined && !req.path.startsWith("/auth")) {
  //   res.redirect("/auth");
  //   return;
  // }
  req.session.email = "hello@stu.naperville203.org";

  next();
});

// to keep this file manageable, we will move the routes to a separate file
//  the exported router object is an example of middleware
//app.use("/", require("./router.js"));
app.get("/", (req, res) => {
  res.redirect('/view');
});

app.use("/view", require("./pages/view/router.js"));
app.use("/edit", require("./pages/edit/router.js"));
app.use("/preferences", require("./pages/preferences/router.js"));

// start the server on port 8080
app.listen(8080, () => {
  console.log("server is listening on http://localhost:8080");
});
