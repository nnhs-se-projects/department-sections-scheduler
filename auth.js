const express = require("express");
const path = require("path");
const route = express.Router();
const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID = "1022838194773-p8g5ac0qr11mfko61qurgnqdb9jitpjf.apps.googleusercontent.com";
const oAuth2 = new OAuth2Client(CLIENT_ID);

// Serve the login page
route.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Handle Google authentication
route.post("/", async (req, res) => {
    try {
        console.log("Received token:", req.body.token);

        const ticket = await oAuth2.verifyIdToken({
            idToken: req.body.token,
            audience: CLIENT_ID,
        });

        const { email } = ticket.getPayload();
        req.session.email = email;
        console.log("Authenticated user:", email);

        // Send JSON response to client
        res.json({ success: true, redirectUrl: "/view" });
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ success: false, error: "Authentication failed" });
    }
});


module.exports = route;
