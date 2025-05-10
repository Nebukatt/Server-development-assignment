const express = require("express");
const passport = require("passport");
const router = express.Router();
const db = require("../models"); // Import database models
const LocalStrategy = require("passport-local").Strategy; // Local strategy for authentication
const bcrypt = require("bcrypt"); // To compare hashed passwords

// Render login page (GET request)
router.get("/login", (req, res) => {
  const messages = req.session.messages || []; // Retrieve any error messages from the session
  const username = req.session.username || "Guest"; // Retrieve the username from session or default to "Guest"
  
  // Render the login page, passing messages and username for display
  res.render("login", { messages: messages, username: username });

  req.session.messages = null; // Clear error messages after rendering
});

// Handle login submission (POST request)
router.post("/login", async (req, res) => {
  const { login, password } = req.body; // Destructure the 'login' and 'password' fields from the request body

  try {
    // Look for an admin user with the given login (username)
    const admin = await db.Admin.findOne({ where: { username: login } });

    if (!admin) {
      // If no admin user found, return Unauthorized error
      return res.status(401).json({
        error: "Unauthorized",
        message: "No user found with that username.",
      });
    }

    // Validate password by comparing the provided password with the stored hashed password
    const isValid = await admin.validatePassword(password);
    if (!isValid) {
      // If password doesn't match, return Unauthorized error
      return res.status(401).json({
        error: "Unauthorized",
        message: "Incorrect password.",
      });
    }

    // If authentication is successful, set session variables
    req.session.isAuthenticated = true;
    req.session.username = admin.username;

    // Respond with a success message and username
    res.json({ message: "Login successful", username: admin.username });
  } catch (err) {
    // Catch any errors and respond with Internal Server Error
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout route to handle user logout and session destruction
router.get("/logout", (req, res) => {
  // Destroy the session when the user logs out
  req.session.destroy((err) => {
    if (err) {
      // If session destruction fails, respond with an error
      return res.status(500).json({ error: "Failed to destroy session." });
    }
    // Redirect the user to the homepage or login page after logout
    res.redirect("/"); 
  });
});

module.exports = router;
