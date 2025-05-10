var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // Retrieve the username from the session or default to "Guest"
  let username = req.session.username || "Guest";

  // Render the "index" view, passing the title and username as variables
  res.render("index", {
    title: "Census Application", // Page title for the home page
    username: username, // Pass the username to the view (could be "Guest" or authenticated user)
  });
});

// Route to set a test session value
router.get("/test-session", (req, res) => {
  // Set a test value in the session
  req.session.testValue = "test";

  // Respond to indicate the session value has been set
  res.send("Session set");
});

// Route to check if a test session value exists
router.get("/check-session", (req, res) => {
  // Send back the session value if set, or a message indicating no session value
  res.json({ testValue: req.session.testValue || "No session value set" });
});

module.exports = router;
