const bcrypt = require("bcrypt");
const { Admin } = require("./models");

async function isThisAdmin(req, res, next) {
  try {
    if (req.session && req.session.isAuthenticated) {
      return next();
    }

    const username = req.headers.username;
    const password = req.headers.password;

    if (!username || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        message:
          "Username and password must be provided in the headers or session must be active.",
      });
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid admin credentials.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid admin credentials.",
      });
    }

    req.user = { id: admin.id, username: admin.username };
    req.session.isAuthenticated = true;

    return next();
  } catch (error) {
    console.error("Error verifying admin credentials:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Error verifying admin credentials.",
    });
  }
}

module.exports = isThisAdmin;
