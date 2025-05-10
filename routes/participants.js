var express = require("express");
var router = express.Router();
var isThisAdmin = require("../isThisAdmin"); // Middleware to check if the user is an admin
const { Participants, Work, Home, Admin } = require("../models");

// Apply authentication middleware to all routes
router.use(isThisAdmin);

// GET endpoint: Renders the participants page with a list of participants and their home and work details
router.get("/index", async function (req, res) {
  try {
    // Fetch all participants along with their home and work details
    const participants = await Participants.findAll({
      include: ["homeDetails", "workDetails"], // Includes the related 'homeDetails' and 'workDetails'
    });

    // Render the 'participants' view and pass the participants data along with the admin's username
    res.render("participants", {
      title: "CensusApp",
      username: req.session.username, // Logged-in admin's username
      participants: participants, // Pass participants to the EJS template
    });
  } catch (err) {
    console.error("Error fetching participants:", err);
    res.status(500).send("Failed to load participants.");
  }
});

// POST request to add a new participant
router.post("/add", async (req, res) => {
  const { email, personalInfo, work, home } = req.body;

  // Validate the request body for required fields
  const validationError = validateParticipant(req.body);
  if (validationError) {
    console.error("Validation Errors:", validationError); // Log validation errors
    return res.status(400).json({ error: validationError });
  }

  try {
    // Check if a participant already exists with the same email
    const existingParticipant = await Participants.findOne({
      where: { email },
    });
    if (existingParticipant) {
      return res.status(409).json({
        error: "Duplicate entry",
        message: "A participant with the same email already exists.",
      });
    }

    // Create a new participant and include their home and work details
    const participant = await Participants.create(
      {
        email,
        firstname: personalInfo.firstname,
        lastname: personalInfo.lastname,
        dob: personalInfo.dob,
        homeDetails: { country: home.country, city: home.city },
        workDetails: {
          companyname: work.companyname,
          salary: work.salary,
          currency: work.currency,
        },
      },
      {
        include: ["homeDetails", "workDetails"], // Include associated home and work models
      }
    );

    return res.status(201).json({
      message: "Participant added successfully.",
      data: participant, // Return the created participant data
    });
  } catch (err) {
    console.error("Error adding participant:", err);
    return res.status(500).json({ error: "Failed to add participant." });
  }
});

// GET endpoint to fetch all participants in JSON format
router.get("/", async (req, res) => {
  try {
    // Fetch all participants with associated home and work details
    const participants = await Participants.findAll({
      include: ["homeDetails", "workDetails"],
    });

    res.json({
      status: "success",
      count: participants.length, // Include count of participants
      data: participants, // Return participant data
    });
  } catch (err) {
    console.error("Error fetching participants:", err);
    res.status(500).json({ error: "Failed to load participants." });
  }
});

// GET endpoint to fetch only personal details of all participants
router.get("/details", async (req, res) => {
  try {
    // Fetch participants and return only the first name, last name, and email fields
    const participants = await Participants.findAll({
      attributes: ["firstname", "lastname", "email"], // Select only necessary fields
    });

    // If no participants are found, return an empty array
    if (participants.length === 0) {
      return res.json({ message: "No participants found", data: [] });
    }

    res.json({
      status: "success",
      count: participants.length, // Include count of participants
      data: participants, // Return participant details
    });
  } catch (err) {
    console.error("Error fetching participant details:", err);
    res.status(500).json({ error: "Failed to load participant details" });
  }
});

// GET endpoint to fetch details of a participant by their email
router.get("/details/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch the participant by email and include home and work details
    const participant = await Participants.findOne({
      where: { email },
      include: ["homeDetails", "workDetails"], // Include associated models
    });

    // If participant not found, return 404 error
    if (!participant) {
      return res.status(404).json({
        status: "error",
        message: "Participant not found",
      });
    }

    // Construct response data
    const details = {
      firstname: participant.firstname,
      lastname: participant.lastname,
      dob: participant.dob,
      email: participant.email,
      home: participant.homeDetails, // Home details
      work: participant.workDetails, // Work details
    };

    res.json({
      status: "success",
      data: details, // Return participant details
    });
  } catch (err) {
    console.error("Error fetching participant details:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch participant details",
    });
  }
});

// DELETE endpoint: Delete a participant by email
router.delete("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Check if the participant exists
    const participant = await Participants.findOne({ where: { email } });

    if (!participant) {
      return res.status(404).json({
        status: "error",
        message: "Participant not found",
      });
    }

    // Delete the participant and handle cascading deletion of related home and work details
    await participant.destroy();

    res.status(200).json({
      status: "success",
      message: "Participant and associated details deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting participant:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to delete participant",
    });
  }
});

// PUT request to update a participant by email
router.put("/:email", async (req, res) => {
  const { email } = req.params;

  // Validate the request body for the update
  const validationError = validateParticipant({
    ...req.body,
    email: "placeholder@example.com", // Dummy email for validation bypass
  });

  if (validationError) {
    console.error("Validation Errors:", validationError);
    return res.status(400).json({ error: validationError });
  }

  try {
    const participant = await Participants.findOne({
      where: { email },
      include: ["homeDetails", "workDetails"],
    });

    if (!participant) {
      return res.status(404).json({
        status: "error",
        message: "Participant not found",
      });
    }

    // Update personal information
    await participant.update({
      firstname: req.body.personalInfo?.firstname || participant.firstname,
      lastname: req.body.personalInfo?.lastname || participant.lastname,
      dob: req.body.personalInfo?.dob || participant.dob,
    });

    // Update home details
    if (req.body.home && participant.homeDetails) {
      await participant.homeDetails.update({
        country: req.body.home?.country || participant.homeDetails.country,
        city: req.body.home?.city || participant.homeDetails.city,
      });
    }

    // Update work details
    if (req.body.work && participant.workDetails) {
      await participant.workDetails.update({
        companyname: req.body.work?.companyname || participant.workDetails.companyname,
        salary: req.body.work?.salary || participant.workDetails.salary,
        currency: req.body.work?.currency || participant.workDetails.currency,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Participant updated successfully",
    });
  } catch (err) {
    console.error("Error updating participant:", err);
    res.status(500).json({ error: "Failed to update participant." });
  }
});

// GET endpoint: Fetch work details of a participant by email
router.get("/work/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch participant and include work details
    const participant = await Participants.findOne({
      where: { email },
      include: ["workDetails"], // Include associated work model
    });

    // If participant or work details are not found
    if (!participant || !participant.workDetails) {
      return res.status(404).json({
        status: "error",
        message: "Work details not found for the given participant",
      });
    }

    res.status(200).json({
      status: "success",
      data: participant.workDetails, // Return the work details
    });
  } catch (err) {
    console.error("Error fetching work details:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch work details",
    });
  }
});

// GET endpoint: Fetch home details of a participant by email
router.get("/home/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch participant and include home details
    const participant = await Participants.findOne({
      where: { email },
      include: ["homeDetails"], // Include associated home model
    });

    // If participant or home details are not found
    if (!participant || !participant.homeDetails) {
      return res.status(404).json({
        status: "error",
        message: "Home details not found for the given participant",
      });
    }

    res.status(200).json({
      status: "success",
      data: participant.homeDetails, // Return the home details
    });
  } catch (err) {
    console.error("Error fetching home details:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch home details",
    });
  }
});

// Helper function for validating participant data
function validateParticipant(data) {
  const errors = [];
  const { email, personalInfo, work, home } = data;

  // Check for email validity
  if (!email) {
    errors.push("Email is required.");
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push("Invalid email format.");
  }

  // Validate personal information
  if (!personalInfo && !(data.firstname && data.lastname && data.dob)) {
    errors.push("Personal information is required.");
  } else {
    const firstname = personalInfo?.firstname || data.firstname;
    const lastname = personalInfo?.lastname || data.lastname;
    const dob = personalInfo?.dob || data.dob;

    if (!firstname) {
      errors.push("First name is required.");
    }
    if (!lastname) {
      errors.push("Last name is required.");
    }
    if (!dob) {
      errors.push("Date of birth (dob) is required.");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      errors.push("DOB must be in YYYY-MM-DD format.");
    }
  }

  // Validate work details
  if (!work) {
    errors.push("Work details are required.");
  } else {
    if (!work.companyname) {
      errors.push("Company name is required in work.");
    }
    if (work.salary === undefined || typeof work.salary !== "number") {
      errors.push("Salary must be a number in work.");
    }
    if (!work.currency) {
      errors.push("Currency is required in work.");
    }
  }

  // Validate home details
  if (!home) {
    errors.push("Home details are required.");
  } else {
    if (!home.country) {
      errors.push("Country is required in home.");
    }
    if (!home.city) {
      errors.push("City is required in home.");
    }
  }

  return errors.length ? errors : null;
}

module.exports = router;
