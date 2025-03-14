const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");


// Load environment variables
dotenv.config({ path: ".env" });


const app = express();


// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
  })
);


// Middleware to handle JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// Authentication routes (should be before the redirect middleware)
app.use("/auth", require("./auth.js"));





// Routes should come AFTER authentication middleware
app.use("/view", require("./pages/view/router.js"));

// Middleware for authentication (redirect if not logged in)
app.use((req, res, next) => {
  if (!req.session.email && !req.path.startsWith("/auth")) {
    return res.redirect("/auth/login");
  }
  next();
});

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.path}`);
  if (!req.session.email && !req.path.startsWith("/auth")) {
    console.log("User not authenticated. Redirecting to /auth/login");
    return res.redirect("/auth/login");
  }
  next();
});



app.use("/edit", require("./pages/edit/router.js"));
app.use("/preferences", require("./pages/preferences/router.js"));


// Redirect root to /view
app.get("/", (req, res) => {
  res.redirect("/view");
});


// Start server
app.listen(8080, () => {
  console.log("Server is listening on http://localhost:8080");
});


