// Import required modules
const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
require("dotenv").config(); // Load environment variables from .env file

// Create a Sequelize instance with database connection configuration
const sequelize = new Sequelize(
  process.env.DATABASE_NAME, // Database name
  process.env.ADMIN_USERNAME, // Database username
  process.env.ADMIN_PASSWORD, // Database password
  {
    host: process.env.HOST, // Host address (Aiven or local)
    port: process.env.DATABASE_PORT, // Port number for the DB connection
    dialect: process.env.DIALECT, // DB dialect (e.g., 'mysql')
    dialectOptions: {
      ssl: {
        require: true, // Enforce SSL connection
        rejectUnauthorized: false // Allow self-signed certificates
      }
    },
    logging: console.log // Set to `false` to disable SQL logging
  }
);

// Create an object to hold the Sequelize instance and all models
const db = {};
db.sequelize = sequelize;

// Automatically import all model files in the current directory (excluding this file)
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // Ignore hidden files (starting with .)
      file !== basename && // Ignore this file (index.js or db.js)
      file.slice(-3) === ".js" // Only include JavaScript files
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize); // Import model
    db[model.name] = model; // Add model to the db object using its name as key
  });

// Run associations if defined in the models (e.g., model.associate = function(db) {...})
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // Set up relationships between models
  }
});

// Export the db object containing Sequelize instance and all models
module.exports = db;
